import { ActionTracker } from "../../tracker/ActionTracker.js";
import victoryPlateMessage from "../data/victory-plate.json";

describe("ActionTracker - Victory Plate", () => {
    let actionTracker;
    beforeEach(() => {
        // Mock current actor
        const mockActor = {
            id: "KiGiuRE16eptMz63",
            name: "Test Actor",
            isOwner: true,
        };

        // Initialize ActionTracker
        actionTracker = new ActionTracker();
        actionTracker.currentActor = mockActor;
        actionTracker.trackedActions[mockActor.id] = [];
    });

    test("should handle victory plate message and prepare correct data", () => {
        // Simulate handling the chat message
        actionTracker.handleChatMessage(victoryPlateMessage);

        // Get the resulting data
        const data = actionTracker.getData();

        // Assertions
        expect(data.characterName).toBe("Test Actor");
        expect(data.totalActions).toBe(2);
        expect(data.actions).toEqual([
            {
                "cost": "F",
                "name": "Victory Plate",
            },
            {
                "cost": "2",
                "name": "Victory Plate",
            },
        ]);
        expect(data.hasUncertainCosts).toBe(false); // No uncertain costs
    });
});