import { ActionTracker } from "../../tracker/ActionTracker.js";
import interactDraw from "../data/interact-draw.json";

describe("ActionTracker - interactDraw", () => {
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
        actionTracker.handleChatMessage(interactDraw);

        // Get the resulting data
        const data = actionTracker.getData();

        // Assertions
        expect(data.characterName).toBe("Test Actor");
        expect(data.totalActions).toBe(1);
        expect(data.actions).toEqual([
            {
                "cost": 1,
                "name": "Interact (Draw (1H))",
            },
        ]);
        expect(data.hasUncertainCosts).toBe(false); // No uncertain costs
    });
});