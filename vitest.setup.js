import { JSDOM } from "jsdom";

// Create a JSDOM instance
const jsdom = new JSDOM();

// Mock the DOMParser globally
global.DOMParser = jsdom.window.DOMParser;

// Mock the Node class globally (for Node.TEXT_NODE, etc.)
global.Node = jsdom.window.Node;

// Mock the Application class
global.Application = class {
    constructor() {
        this.options = {};
    }
    render(force = false) {
        console.log("Mock render called with force:", force);
    }
    static get defaultOptions() {
        return {};
    }
};

// Mock the global game object
global.game = {
    settings: {
        get: vi.fn((module, setting) => {
            if (setting === "showStatusIcons") return true; // Enable status icons
            return false;
        }),
    },
    combats: [
        {
            active: true,
            round: 3,
        },
    ],
    user: {
        isGM: true,
    },
};

// Mock the Hooks object
global.Hooks = {
    on: vi.fn(),
    callAll: vi.fn(),
};

// Mock the Handlebars object
global.Handlebars = {
    registerHelper: vi.fn((name, fn) => {
        console.log(`Mock Handlebars helper registered: ${name}`);
    }),
    compile: vi.fn((template) => {
        console.log("Mock Handlebars template compiled");
        return (context) => `Mock template output for context: ${JSON.stringify(context)}`;
    }),
};