import { ActionTracker } from "../../tracker/ActionTracker.js";
import releaseDrop from "../data/release-drop.json";

describe("ActionTracker - interactDrop", () => {
    let actionTracker;
    beforeEach(() => {
        // Mock current actor
        const mockActor = {
            id: "KiGiuRE16eptMz63",
            name: "Test Actor",
            isOwner: true,
            items: [],
        };

        // Initialize ActionTracker
        actionTracker = new ActionTracker();
        actionTracker.currentActor = mockActor;
        actionTracker.trackedActions[mockActor.id] = [];
    });

    test("should handle message and prepare correct data", () => {
        // Simulate handling the chat message
        actionTracker.handleChatMessage(releaseDrop);

        // Get the resulting data
        const data = actionTracker.getData();

        // Assertions
        expect(data.characterName).toBe("Test Actor");
        expect(data.totalActions).toBe(0);
        expect(data.actions).toEqual([
            {
                "cost": 0,
                "name": "Release (Drop)",
            },
        ]);
        expect(data.hasUncertainCosts).toBe(false); // No uncertain costs
    });
});