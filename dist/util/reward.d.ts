import { Account } from '../model/common/account';
import { TransactionType } from '../model/common/transaction/type';
import { AirdropReward, Timestamp, StakeReward, VoteType } from '../model/common/type';
import { Stake } from '../model/common/transaction/stake';
import { ConfigSchema } from '../config';
import { IFeatureController } from './feature';
export interface IStakeRewardPercentCalculator {
    calculatePercent(height: number): number;
}
export declare class StakeRewardPercentCalculator implements IStakeRewardPercentCalculator {
    private readonly milestones;
    private readonly distance;
    constructor(milestones: Array<number>, distance: number);
    private calculateMilestone;
    calculatePercent(height: number): number;
}
export interface IRewardCalculator {
    calculateTotalRewardAndUnstake(createdAt: Timestamp, stakes: Array<Stake>, voteType: VoteType, lastBlockHeight: number): StakeReward;
    calculateAirdropReward(sender: Account, amount: number, transactionType: TransactionType, availableAirdropBalance: number): AirdropReward;
}
export declare class RewardCalculator implements IRewardCalculator {
    private readonly percentCalculator;
    private readonly rewardVoteCount;
    private readonly unstakeVoteCount;
    private readonly stakeRewardPercent;
    private readonly referralPercentPerLevel;
    private readonly arpFeatureController;
    constructor(rewardVoteCount: number, unstakeVoteCount: number, stakeRewardPercent: number, referralPercentPerLevel: Array<number>, percentCalculator: IStakeRewardPercentCalculator, arpFeatureController: IFeatureController);
    calculateTotalRewardAndUnstake(createdAt: Timestamp, stakes: Array<Stake>, voteType: VoteType, lastBlockHeight: number): StakeReward;
    calculateAirdropReward(sender: Account, amount: number, transactionType: TransactionType, availableAirdropBalance: number): AirdropReward;
}
export declare const initRewardCalculator: (config: ConfigSchema) => IRewardCalculator;
