"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAirdropReward = (sponsors = new Map()) => {
    return {
        sponsors,
    };
};
exports.calculateTotalAirdropReward = (airdrop) => {
    let totalAirdropReward = 0;
    airdrop.sponsors.forEach((reward) => {
        totalAirdropReward += reward;
    });
    return totalAirdropReward;
};
