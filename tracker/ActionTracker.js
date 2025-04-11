import { id as SCRIPT_ID, title } from "../module.json";
import { info, debug, settings, getSettings, determineChatType, ChatType } from "./ActionTrackerUtilities.js";

export class ActionTracker extends Application {
    constructor(options) {
        super(options);
        this.trackedActions = {};
        this.currentActor = null; // Track the current actor
        this.statuses = []; // Track statuses
        this.currentRound = 0; // Track the current round
        this.initHooks();
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: SCRIPT_ID,
            title: title,
            template: `modules/${SCRIPT_ID}/templates/tracker.hbs`,
            width: 300,
            height: "auto",
            resizable: false,
            classes: [title],
            popOut: true,
        });
    }

    /** Define wWhat should trigger a re-render of the tracker */
    initHooks() {
        Hooks.on("updateCombat", this.handleCombatChange.bind(this));
        Hooks.on("renderChatMessage", this.handleChatMessage.bind(this));
    }

    unrender() {
        // Unrender the tracker and remove hooks
        if (this.rendered) {
            this.close();
        }
        Hooks.off("updateCombat", this.handleCombatChange.bind(this));
        Hooks.off("renderChatMessage", this.handleChatMessage.bind(this));
    }

    renderTracker() {
        // Check if the Action Tracker is enabled
        if (!getSettings(settings.enabled.id)) {
            return;
        }

        // Get the active combat in the current scene
        const activeScene = game.scenes?.active; // Get the currently active scene
        const activeCombat = game.combats?.find(c => c.active && c.scene.id === activeScene?.id);

        if (activeCombat) {
            const currentCombatant = activeCombat.combatants.get(activeCombat.current.combatantId);
            this.currentRound = activeCombat?.round || 0; // Calculate the current round
            this.currentActor = currentCombatant?.actor;

            const isOwnedByUser = currentCombatant?.actor?.isOwner || false; // Ensure currentCombatant is defined

            const isGM = game.user.isGM;

            if (isOwnedByUser || isGM) {
                this.render(true);
                return;
            }
        }
        this.close(); // Close the tracker if not owned by the user or if no active combat
    }


    
    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        
        // Button handlers
        html.find(".remove-action-btn").on("click", this._onRemoveAction.bind(this));
        html.find(".prev-turn-btn").on("click", this._onPreviousTurn.bind(this)); // Listener for "Previous Turn" button
        html.find(".next-turn-btn").on("click", this._onNextTurn.bind(this)); // Listener for "Next Turn" button
    }

    handleCombatChange(combat) {
        this.statuses = []; // Reset statuses on turn change
        this.currentRound = combat?.current?.round || this.currentRound; // Update the current round
        
        const currentCombatant = combat.combatants.get(combat.current.combatantId)?.actor;
        
        this.currentActor = currentCombatant;
        if (!this.currentActor) return; // Exit if no current actor

        // Initialize tracked actions for the current actor if not already present
        this.trackedActions[this.currentActor.id] = [];

        this.renderTracker(); // Render the tracker
    }

    handleChatMessage(message) {
        const actorId = message.speaker?.actor;
        if (!actorId) return;

        const chatType = determineChatType(message);
        let actions = [];

        switch (chatType) {
            case ChatType.ACTION:
                actions = this.parseActionMessage(message.flavor);
                break;
            case ChatType.ACTION_CARD:
                actions = this.parseActionCardMessage(message.content);
                break;
            case ChatType.ITEM_CARD:
                actions = this.parseChatCardMessage(message.content);
                break;
            case ChatType.STATUS_UPDATE:
                this.updateStatusesFromMessage(message.content);
                break;
            default:
                debug(`Unknown chat type for message: ${message.content}`);
                return;
        }

        // Track actions if any were found
        if (actions.length > 0) {
            if (!this.trackedActions[actorId]) {
                this.trackedActions[actorId] = [];
            }

            // Remove previous messages with the same id
            this.trackedActions[actorId] = this.trackedActions[actorId].filter(action => action.messageId !== message.id);

            // Add the new actions with the message id
            actions.forEach(action => action.messageId = message.id);
            this.trackedActions[actorId].push(...actions);

            this.render(false);
        }
    }

    parseActionMessage(content) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");

        const actions = [];
        const actionElement = doc.querySelector("h4.action strong");
        const actionSubtitle = doc.querySelector("h4.action .subtitle span");
        const actionGlyph = doc.querySelector("h4.action .action-glyph");

        if (actionElement) {
            const actionName = actionElement.textContent.trim().toLowerCase();

            // Exclude actions containing specific keywords
            const excludedKeywords = ["saving throw", "initiative"];
            if (!excludedKeywords.some(keyword => actionName.includes(keyword))) {
                const trimmedCost = actionGlyph?.textContent?.trim();
                const parsedCost = parseInt(trimmedCost, 10);
                const cost = !isNaN(parsedCost) ? parsedCost : ("" + trimmedCost).length === 1 ? 0 : 1;
                
                const subtitle = actionSubtitle ? actionSubtitle.textContent.trim() : null;
                var name = actionElement.textContent.trim() + (subtitle ? ` (${subtitle})` : "");

                actions.push({ name, cost });
            }
        }

        return actions;
    }

    parseActionCardMessage(content) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");

        const actions = [];
        const actionCards = doc.querySelectorAll(".pf2e.chat-card.action-card");
        this._pushActionGlyphs(actionCards, actions);

        return actions;
    }

    parseChatCardMessage(content) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");

        const actions = [];
        const chatCards = doc.querySelectorAll(".pf2e.chat-card");
        this._pushActionGlyphs(chatCards, actions);
        return actions;
    }

    
    updateStatusesFromMessage(content) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");

        const newStatuses = [];
        const conditions = doc.querySelectorAll(".participant-conditions ul li");
        conditions.forEach(condition => {
            const icon = condition.querySelector("img")?.src || "";
            const name = condition.querySelector(".name")?.textContent.trim() || "";
            if (icon && name) {
                newStatuses.push({ icon, name });
            }
        });

        this.statuses = newStatuses;
        this.renderTracker(); // Re-render the tracker to update statuses
    }

    _pushActionGlyphs(actionCards, actions) {
        actionCards.forEach(card => {
            const nameElement = card.querySelector("h3");
            if (nameElement) {
                const actionName = Array.from(nameElement.childNodes)
                    .filter(node => node.nodeType === Node.TEXT_NODE) // Keep only text nodes
                    .map(node => node.textContent.trim())
                    .join(""); // Combine the text content

                let actionGlyphs = Array.from(card.querySelectorAll("header .action-glyph"))
                    .filter(glyph => !glyph.closest("button[data-variant]")) // Exclude glyphs inside data-variant buttons
                
                if (actionName && actionGlyphs.length === 0) {
                    actionGlyphs = Array.from(card.querySelectorAll(".action-glyph"))
                        .filter(glyph => !glyph.closest("button[data-variant]")) // Exclude glyphs inside data-variant buttons
                }

                if (actionName && actionGlyphs.length > 0) {
                    actionGlyphs
                        .map(glyph => glyph.textContent.trim())
                        .forEach(actionGlyph => {
                        actions.push({ name: actionName, cost: actionGlyph });
                    });
                }
            }
        });
    }

    // Bindings
    _onRemoveAction(event) {
        event.preventDefault();
        const button = event.target;
        const index = parseInt(button.dataset.index, 10); // Get the index from the button
        const actorId = this.currentActor?.id;

        if (!isNaN(index) && actorId && this.trackedActions[actorId]) {
            // Remove the action from the list
            this.trackedActions[actorId].splice(index, 1);

            // Re-render the tracker
            this.render(true);
        }
    }

    _onPreviousTurn(event) {
        event.preventDefault();
        const activeCombat = game.combats?.find(c => c.active);
        if (activeCombat && game.user.isGM) {
            activeCombat.previousTurn(); // Go back to the previous turn
            this.render(true); // Re-render the tracker
        }
    }

    _onNextTurn(event) {
        event.preventDefault();
        const activeCombat = game.combats?.find(c => c.active);
        if (activeCombat && game.user.isGM) {
            activeCombat.nextTurn(); // Advance to the next turn
            this.render(true); // Re-render the tracker
        }
    }

    getData() {
        // Prepare data for the Handlebars template
        const actorId = this.currentActor?.id;
        const actions = this.trackedActions[actorId] || [];

        let totalActions = 0;
        let hasUncertainCosts = false;

        actions.forEach(action => {
            const cost = parseInt(action.cost, 10);
            if (("" + action.cost).length === 1 && !isNaN(cost)) {
                totalActions += cost;
            } else if (("" + action.cost).length !== 1) {
                hasUncertainCosts = true;
            }
        });

        const showStatusIcons = game.settings.get(SCRIPT_ID, settings.showStatusIcons.id); // Get the setting value

        return {
            characterName: this.currentActor?.name || "Unknown",
            totalActions,
            actions,
            currentRound: this.currentRound, // Include the current round
            statuses: showStatusIcons ? this.statuses : [], // Include statuses only if the setting is enabled
            showTurnButtons: game.user.isGM, // Show turn buttons only for GMs
            hasUncertainCosts, // Include flag for uncertain costs
            isGM: game.user.isGM, // Include flag for GM status
        };
    }
}

Handlebars.registerHelper("range", function(start, end) {
    return Array.from({ length: end - start }, (_, i) => i + start);
});

Handlebars.registerHelper("add", function(a, b) {
    return a + b;
});
