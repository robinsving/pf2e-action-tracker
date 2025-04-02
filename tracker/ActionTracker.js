import { id as SCRIPT_ID, title } from "../module.json";
import { info, settings, determineChatType, ChatType } from "./ActionTrackerUtilities.js";

export class ActionTracker extends Application {
    constructor(options) {
        super(options);
        this.trackedActions = {};
        this.currentActor = null; // Track the current actor
        this.statuses = []; // Track statuses
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
        });
    }

    initHooks() {
        Hooks.on("renderEncounterTrackerPF2e", this.handleTurnChange.bind(this));
        Hooks.on("updateCombat", this.handleTurnChange.bind(this));
        Hooks.on("renderChatMessage", this.handleChatMessage.bind(this));
    }

    renderCombat() {
        // Get the active combat in the current scene
        const activeScene = game.scenes?.active; // Get the currently active scene
        const activeCombat = game.combats?.find(c => c.active && c.scene.id === activeScene?.id);

        if (activeCombat) {
            const currentCombatant = activeCombat.combatants.get(activeCombat.current.combatantId);
            if (currentCombatant?.actor) {
                this.currentActor = currentCombatant.actor;

                // Initialize tracked actions for the current actor if not already present
                if (!this.trackedActions[this.currentActor.id]) {
                    this.trackedActions[this.currentActor.id] = [];
                }
            } else {
                this.currentActor = null; // Reset current actor if not found
            }
        }

        // Render without bringing to front
        this.render(true);
    }
    
    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        
        // Button handlers
        html.find(".remove-action-btn").on("click", this._onRemoveAction.bind(this));
        html.find(".prev-turn-btn").on("click", this._onPreviousTurn.bind(this)); // Listener for "Previous Turn" button
        html.find(".next-turn-btn").on("click", this._onNextTurn.bind(this)); // Listener for "Next Turn" button
    }

    handleTurnChange(combat, changed) {
        this.statuses = []; // Reset statuses on turn change
        if (changed?.turn !== undefined) {
            const currentCombatant = combat.combatants.get(combat.current.combatantId);
            if (currentCombatant?.actor) {
                const isOwnedByUser = currentCombatant.actor.isOwner;
                const isGM = game.user.isGM;

                if (isOwnedByUser || isGM) {
                    this.currentActor = currentCombatant.actor;
                    this.resetActions(currentCombatant.actor.id);
                    this.renderCombat();
                }
            }
        }
    }

    handleChatMessage(message) {
        const actorId = message.speaker?.actor;
        if (!actorId) return;

        const chatType = determineChatType(message.flavor || message.content || "");
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
                info(`Unknown chat type for message: ${message.content}`);
                return;
        }

        // Track actions if any were found
        if (actions.length > 0) {
            this.trackActions(actorId, actions);
        }
    }

    parseActionMessage(content) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");

        const actions = [];
        const actionElement = doc.querySelector("h4.action strong");
        const actionGlyph = doc.querySelector("h4.action .action-glyph");

        if (actionElement) {
            const actionName = actionElement.textContent.trim();
            const cost = actionGlyph ? parseInt(actionGlyph.textContent.trim(), 10) : 1; // Default cost is 1 if no glyph is present
            actions.push({ name: actionName, cost });
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
        const chatCards = doc.querySelectorAll(".pf2e.chat-card.item-card");
        this._pushActionGlyphs(chatCards, actions);
        return actions;
    }

    _pushActionGlyphs(actionCards, actions) {
        actionCards.forEach(card => {
            const nameElement = card.querySelector("h3");
            if (nameElement) {
                const actionName = Array.from(nameElement.childNodes)
                    .filter(node => node.nodeType === Node.TEXT_NODE) // Keep only text nodes
                    .map(node => node.textContent.trim())
                    .join(""); // Combine the text content

                const actionGlyphs = Array.from(card.querySelectorAll(".action-glyph"))
                    .filter(glyph => !glyph.closest("button[data-variant]")) // Exclude glyphs inside data-variant buttons
                    .map(glyph => glyph.textContent.trim()); // Extract text content

                if (actionName && actionGlyphs.length > 0) {
                    actionGlyphs.forEach(actionGlyph => {
                        actions.push({ name: actionName, cost: actionGlyph });
                    });
                }
            }
        });
    }

    trackActions(actorId, actions) {
        if (!this.trackedActions[actorId]) {
            this.trackedActions[actorId] = [];
        }
        this.trackedActions[actorId].push(...actions);
        this.render(false);
    }

    resetActions(actor) {
        this.trackedActions[actor] = [];
        this.render(false);
    }

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
        this.render(true); // Re-render the tracker to update statuses
    }

    getData() {
        // Prepare data for the Handlebars template
        const actorId = this.currentActor?.id;
        const actions = this.trackedActions[actorId] || [];
        const totalActions = actions
            .map(action => parseInt(action.cost, 10))
            .filter(cost => !isNaN(cost)) // Exclude non-numeric values
            .reduce((sum, cost) => sum + cost, 0);

        const activeCombat = game.combats?.find(c => c.active);
        const currentRound = activeCombat?.round || 0; // Calculate the current round

        const showStatusIcons = game.settings.get(SCRIPT_ID, settings.showStatusIcons.id); // Get the setting value

        return {
            characterName: this.currentActor?.name || "Unknown",
            totalActions,
            actions,
            currentRound, // Include the current round
            statuses: showStatusIcons ? this.statuses : [], // Include statuses only if the setting is enabled
            showTurnButtons: game.user.isGM, // Show turn buttons only for GMs
        };
    }
}

Handlebars.registerHelper("range", function(start, end) {
    return Array.from({ length: end - start }, (_, i) => i + start);
});

Handlebars.registerHelper("add", function(a, b) {
    return a + b;
});
