import { determineChatType, ChatType } from "../tracker/ActionTrackerUtilities.js";

import unarmedStrike from "./data/unarmed-strike.json";
import brambleBush from "./data/bramble-bush.json";
import forceBarrage from "./data/force-barrage.json";
import reachMetamagic from "./data/reach-metamagic.json";
import arcaneBond from "./data/arcane-bond.json";
import interactDrop from "./data/release-drop.json";
import interactDraw from "./data/interact-draw.json";
import fortitudeSave from "./data/fortitude-saving-throw.json";
import victoryPlate from "./data/victory-plate.json";
import shieldBlock from "./data/shield-block.json";
import criticalDamage from "./data/critical-damage.json";
import stand from "./data/stand.json";
import chaliceOfJustice from "./data/chalice-of-justice.json";
import arcanaCheck from "./data/arcana-check.json";

describe("determineChatType", () => {
    test("should handle full message for an unarmed strike", () => {
        const result = determineChatType(unarmedStrike);
        expect(result).toEqual(ChatType.ACTION);
    });
});

describe("determineChatType", () => {
    test("should handle full message for a spell", () => {
        const result = determineChatType(brambleBush);
        expect(result).toEqual(ChatType.ITEM_CARD);
    });
});

describe("determineChatType", () => {
    test("should handle type for odd spell", () => {
        const result = determineChatType(forceBarrage);
        expect(result).toEqual(ChatType.ITEM_CARD);
    });
});

describe("determineChatType", () => {
    test("should handle type for reach metamagic", () => {
        const result = determineChatType(reachMetamagic);
        expect(result).toEqual(ChatType.ITEM_CARD);
    });
});

describe("determineChatType", () => {
    test("should handle type for arcaneBond", () => {
        const result = determineChatType(arcaneBond);
        expect(result).toEqual(ChatType.ITEM_CARD);
    });
});

describe("determineChatType", () => {
    test("should handle type for drop", () => {
        const result = determineChatType(interactDrop);
        expect(result).toEqual(ChatType.ACTION);
    });
});

describe("determineChatType", () => {
    test("should handle type for draw", () => {
        const result = determineChatType(interactDraw);
        expect(result).toEqual(ChatType.ACTION);
    });
});

describe("determineChatType", () => {
    test("should handle type for feat", () => {
        const result = determineChatType(fortitudeSave);
        expect(result).toEqual(ChatType.IGNORED);
    });
});

describe("determineChatType", () => {
    test("should handle type for victory-plate", () => {
        const result = determineChatType(victoryPlate);
        expect(result).toEqual(ChatType.ITEM_CARD);
    });
});

describe("determineChatType", () => {
    test("should handle type for shield-block", () => {
        const result = determineChatType(shieldBlock);
        expect(result).toEqual(ChatType.ITEM_CARD);
    });
});

describe("determineChatType", () => {
    test("should handle type for critical-damage", () => {
        const result = determineChatType(criticalDamage);
        expect(result).toEqual(ChatType.IGNORED);
    });
});

describe("determineChatType", () => {
    test("should handle type for stand", () => {
        const result = determineChatType(stand);
        expect(result).toEqual(ChatType.ACTION_CARD);
    });
});

describe("determineChatType", () => {
    test("should handle type for chaliceOfJustice", () => {
        const result = determineChatType(chaliceOfJustice);
        expect(result).toEqual(ChatType.ITEM_CARD);
    });
});

describe("determineChatType", () => {
    test("should handle type for arcanaCheck", () => {
        const result = determineChatType(arcanaCheck);
        expect(result).toEqual(ChatType.IGNORED);
    });
});
