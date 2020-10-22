"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FeatureController {
    constructor(enableBlockHeight) {
        this.enableBlockHeight = enableBlockHeight;
    }
    isEnabled(blockHeight) {
        return blockHeight >= this.enableBlockHeight;
    }
}
exports.FeatureController = FeatureController;
