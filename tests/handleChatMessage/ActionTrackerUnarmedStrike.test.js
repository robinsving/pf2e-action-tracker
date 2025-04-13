import { expect } from "vitest";
import { ActionTracker } from "../../tracker/ActionTracker.js";
import unarmedStrike from "../data/unarmed-strike.json";

describe("ActionTracker - unarmed-strike", () => {
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
        actionTracker.handleChatMessage(unarmedStrike);

        // Get the resulting data
        const data = actionTracker.getData();

        // Assertions
        expect(actionTracker.trackedActions).toEqual({
            "KiGiuRE16eptMz63": [
              {
                "cost": 1,
                "name": "Melee Strike: Unarmed Attack",
              },
            ],
        });

        expect(actionTracker.currentActor.id).toBe("KiGiuRE16eptMz63");
        
        expect(data.characterName).toBe("Test Actor");
        expect(data.totalActions).toBe(1);

        expect(data.actions).toEqual([
            {
                "cost": 1,
                "name": "Melee Strike: Unarmed Attack",
            },
        ]);
        expect(data.hasUncertainCosts).toBe(false);
    });
});