import { expect } from "vitest";
import { ActionTracker } from "../../tracker/ActionTracker.js";
import healX from "../data/heal-x.json";

describe("ActionTracker - heal-x", () => {
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

    test("should handle heal-x message and prepare correct data", () => {
        // Simulate handling the chat message
        actionTracker.handleChatMessage(healX);

        // Get the resulting data
        const data = actionTracker.getData();

        // Assertions
        expect(actionTracker.trackedActions).toEqual({
            "KiGiuRE16eptMz63": [
                {
                    name: "Heal",
                    cost: "1 – 3",
                },
            ],
        });

        expect(actionTracker.currentActor.id).toBe("KiGiuRE16eptMz63");
        
        expect(data.characterName).toBe("Test Actor");
        expect(data.totalActions).toBe(0);

        expect(data.actions).toEqual([
            {
                name: "Heal",
                cost: "1 – 3",
            },
        ]);
        expect(data.hasUncertainCosts).toBe(true);
    });
});