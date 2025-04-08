import { id as SCRIPT_ID, title } from "../module.json";
import { info, debug, settings } from "./ActionTrackerUtilities.js";
import { ActionTracker } from "./ActionTracker.js";

let isInitialized = false;

const API = {
    trackerInstance: null, // Singleton instance of ActionTracker
    actionTrackerApp: () => {
        if (!API.trackerInstance) {
            API.trackerInstance = new ActionTracker();
        }
        return API.trackerInstance;
    },
};

// Private function to render the Action Tracker
function _renderActionTracker(context = "default") {
    if (!isInitialized) {
        // Scene change triggered before initialization. Ignoring
        return;
    }
    // Check if there is an active combat in the current scene
    const activeCombat = game.combats?.find(c => c.active && c.scene.id === game.scenes?.current?.id);

    const tracker = API.actionTrackerApp();
    if (activeCombat) {
        tracker.renderCombat();
        debug(`${title} rendered for ${context}.`);
    } else if (tracker.rendered) {
        tracker.close();
        debug(`No active combat found for ${context}. ${title} un-rendered.`);
    }
}

// Register settings during the "init" hook
Hooks.once("init", () => {
    game.settings.register(SCRIPT_ID, settings.autoRenderOnSceneChange.id, {
        name: settings.autoRenderOnSceneChange.name,
        hint: settings.autoRenderOnSceneChange.hint,
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
    });

    game.settings.register(SCRIPT_ID, settings.autoRenderOnCombatStart.id, {
        name: settings.autoRenderOnCombatStart.name,
        hint: settings.autoRenderOnCombatStart.hint,
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
    });

    game.settings.register(SCRIPT_ID, settings.gm.id, {
        name: settings.gm.name,
        hint: settings.gm.hint,
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
    });

    game.settings.register(SCRIPT_ID, settings.debug.id, {
        name: settings.debug.name,
        hint: settings.debug.hint,
        scope: "world",
        config: true,
        type: Boolean,
        default: false,
    });

    game.settings.register(SCRIPT_ID, settings.showStatusIcons.id, {
        name: settings.showStatusIcons.name,
        hint: settings.showStatusIcons.hint,
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
    });

    debug("Settings registered during init hook");
    isInitialized = true;
});

// Initialize the Action Tracker when the Foundry VTT environment is ready
Hooks.once("ready", () => {
    // Register the API
    game.modules.get(SCRIPT_ID).api = API;

    debug("Module is ready");
    _renderActionTracker("ready hook");
});

// Automatically open the Action Tracker when an encounter starts
Hooks.on("combatStart", (combat) => {
    debug(`Combat started: ${combat.name}.`);
    _renderActionTracker("new combat");
});

// Handle scene changes
Hooks.on("canvasReady", (scene) => {
    debug(`Scene switched to: ${scene.name}.`);
    _renderActionTracker("scene change");
});

// Handle combat end
Hooks.on("deleteCombat", (combat) => {
    debug(`Combat ended: ${combat.name}.`);
    const tracker = API.actionTrackerApp();
    if (tracker.rendered) {
        tracker.close();
        debug(`${title} un-rendered due to combat end.`);
    }
});