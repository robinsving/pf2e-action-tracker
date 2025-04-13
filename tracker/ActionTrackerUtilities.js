import { id as SCRIPT_ID, title } from "../module.json";

export const settings = {
    enabled: { id: "enabled", name: "Enable Action Tracker", hint: "Enable or disable the Action Tracker." },
    gm: { id: "forGmOnly", name: "Access to GM only", hint: "If 'false', users will be able to run for their owned characters" },
    debug: { id: "debugMode", name: "Enable Debugging", hint: "Print debug to console log" },
    autoRenderOnSceneChange: { id: "autoRenderOnSceneChange", name: "Auto Render on Scene Change", hint: "Automatically render the Action Tracker when the scene changes." },
    autoRenderOnCombatStart: { id: "autoRenderOnCombatStart", name: "Auto Render on Combat Start", hint: "Automatically render the Action Tracker when a new combat starts." },
    showStatusIcons: { id: "showStatusIcons", name: "Show Status Icons", hint: "Enable or disable the display of status icons in the tracker." },
    trackMovement: { id: "trackMovementActions", name: "Track Movement (experimental)", hint: "Enable or disable tracking of movement by looking at token movement." },
}

export function popup(message) {
    ui.notifications.info(`${title}: ${message}`);
}

export function debug(message) {
    if (game.settings.get(SCRIPT_ID, settings.debug.id))
        console.debug(`${title}: ${message}`);
}

export function info(message) {
    console.info(`${title}: ${message}`);
}

export function getSettings(setting) {
    return game.settings.get(SCRIPT_ID, setting);
}

export const ChatType = {
    ACTION: "ACTION",
    ACTION_CARD: "ACTION_CARD",
    ITEM_CARD: "ITEM_CARD",
    STATUS_UPDATE: "STATUS_UPDATE",
    IGNORED: "IGNORED",
    UNKNOWN: "UNKNOWN",
};

/**
 * Determines the type of a chat message based on its flags and origin data.
 * @param {object} message - The chat message object.
 * @returns {object} An object containing the type of the chat message
 */
export function determineChatType(message) {
    console.debug("Processing message:", message);
    
    const contextType = message.flags?.pf2e?.context?.type;
    const originType = message.flags?.pf2e?.origin?.type;

    // Determine the type based on the origin type
    if (["damage-roll", "saving-throw", "skill-check"].includes(contextType)) {
        return ChatType.IGNORED;
    } else if ((message.content + message.flavor).includes("pf2e chat-card item-card")) {
        return ChatType.ITEM_CARD;
    } else if ((message.content + message.flavor).includes("pf2e chat-card weapon-card")) {
        return ChatType.ITEM_CARD;
    } else if ((message.content + message.flavor).includes("pf2e chat-card action-card")) {
        return ChatType.ACTION_CARD;
    } else if ((message.content + message.flavor).includes("class=\"action\"")) {
        return ChatType.ACTION;
    } else if ((message.content + message.flavor).includes("participant-conditions")) {
        return ChatType.STATUS_UPDATE
    }
    

    return ChatType.UNKNOWN;
}