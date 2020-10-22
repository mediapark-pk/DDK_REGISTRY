import { Timestamp, AirdropReward } from '../type';

export type StakeSchema = {
    createdAt: Timestamp;
    isActive: boolean;
    amount: number;
    voteCount: number;
    nextVoteMilestone: Timestamp;
    airdropReward: AirdropReward;
    sourceTransactionId: Buffer;
    previousMilestones?: Array<number>;
};

export class Stake implements StakeSchema {
    createdAt: Timestamp;
    isActive: boolean;
    amount: number;
    voteCount: number;
    nextVoteMilestone: Timestamp;
    airdropReward: AirdropReward;
    sourceTransactionId: Buffer;
    previousMilestones: Array<number>;

    constructor(data: StakeSchema) {
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
