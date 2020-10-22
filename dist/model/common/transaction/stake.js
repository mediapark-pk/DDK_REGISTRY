"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Stake {
    constructor(data) {
        this.createdAt = data.createdAt;
        this.isActive = data.isActive;
        this.amount = data.amount;
        this.voteCount = data.voteCount;
        this.nextVoteMilestone = data.nextVoteMilestone;
        this.airdropReward = data.airdropReward;
        this.sourceTransactionId = data.sourceTransactionId;
        this.previousMilestones = data.previousMilestones || [];
    }
}
exports.Stake = Stake;
