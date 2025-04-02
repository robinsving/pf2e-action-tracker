import { id as SCRIPT_ID, title } from "../module.json";

export const settings = {
    gm: { id: "forGmOnly", name: "Access to GM only", hint: "If 'false', users will be able to run for their owned characters" },
    debug: { id: "debugMode", name: "Enable Debugging", hint: "Print debug to console log" },
    autoRenderOnSceneChange: { id: "autoRenderOnSceneChange", name: "Auto Render on Scene Change", hint: "Automatically render the Action Tracker when the scene changes." },
    autoRenderOnCombatStart: { id: "autoRenderOnCombatStart", name: "Auto Render on Combat Start", hint: "Automatically render the Action Tracker when a new combat starts." },
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
    UNKNOWN: "UNKNOWN",
};

/**
 * Determines the type of a chat message based on its content.
 * @param {string} message - The HTML string of the chat message.
 * @returns {string} The type of the chat message (ACTION, ACTION-CARD, CHAT-CARD, or UNKNOWN).
 */
export function determineChatType(message) {
    if (message.includes("pf2e chat-card action-card")) {
        return ChatType.ACTION_CARD;
    }
    if (message.includes("pf2e chat-card item-card")) {
        return ChatType.ITEM_CARD;
    }
    if (message.includes("class=\"action\"")) {
        return ChatType.ACTION;
    }
    return ChatType.UNKNOWN;
}