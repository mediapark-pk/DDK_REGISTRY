/// <reference types="node" />
import { Timestamp, AirdropReward } from '../type';
export declare type StakeSchema = {
    createdAt: Timestamp;
    isActive: boolean;
    amount: number;
    voteCount: number;
    nextVoteMilestone: Timestamp;
    airdropReward: AirdropReward;
    sourceTransactionId: Buffer;
    previousMilestones?: Array<number>;
};
export declare class Stake implements StakeSchema {
    createdAt: Timestamp;
    isActive: boolean;
    amount: number;
    voteCount: number;
    nextVoteMilestone: Timestamp;
    airdropReward: AirdropReward;
    sourceTransactionId: Buffer;
    previousMilestones: Array<number>;
    constructor(data: StakeSchema);
}
