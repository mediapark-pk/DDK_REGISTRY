import { Account } from '../model/common/account';
import { TransactionType } from '../model/common/transaction/type';
import { Address, AirdropReward, Timestamp, StakeReward, VoteType } from '../model/common/type';
import { StakeSchema, Stake } from '../model/common/transaction/stake';
import { ConfigSchema } from '../config';
import { IFeatureController, FeatureController } from './feature';

export interface IStakeRewardPercentCalculator {
    calculatePercent(height: number): number;
}

export class StakeRewardPercentCalculator implements IStakeRewardPercentCalculator {
    private readonly milestones: Array<number>;
    private readonly distance: number;

    constructor(milestones: Array<number>, distance: number) {
        this.milestones = milestones;
        this.distance = distance;
    }

    private calculateMilestone(height: number): number {
        if (height <= 3153600) {
            return 0.1;
        }   else if (height > 3153600 && height <= 4730400) {
            return 0.08;
        }   else if (height > 4730400 && height <= 6307200) {
            return 0.06;
        }   else if (height > 6307200 && height <= 7884000) {
            return 0.04;
        }   else if(height > 7884000) {
            return 0.02;
        }
        console.log('milestones and distance and height', this.milestones, this.distance, height);
        const location = Math.trunc((height) / this.distance);
        console.log('location', location);
        const lastMile = this.milestones[this.milestones.length - 1];
        console.log('lastMile', lastMile);
        
        if (location > (this.milestones.length - 1)) {
            const milestones = this.milestones.lastIndexOf(lastMile);
            console.log('after calculation location Milestones', milestones);
            return milestones;
        }
        return location;
    }

    calculatePercent(height: number): number {
        console.log('height in calculatePercent', height);
        const milestones = this.calculateMilestone(height);
        console.log('calcualte percent', milestones);
        return milestones;
    }
}

export interface IRewardCalculator {
    calculateTotalRewardAndUnstake(
        createdAt: Timestamp,
        stakes: Array<Stake>,
        voteType: VoteType,
        lastBlockHeight: number,
    ): StakeReward;
    calculateAirdropReward(
        sender: Account,
        amount: number,
        transactionType: TransactionType,
        availableAirdropBalance: number,
    ): AirdropReward;
}

export class RewardCalculator implements IRewardCalculator {
    private readonly percentCalculator: IStakeRewardPercentCalculator;
    private readonly rewardVoteCount: number;
    private readonly unstakeVoteCount: number;
    private readonly stakeRewardPercent: number;
    private readonly referralPercentPerLevel: Array<number>;
    private readonly arpFeatureController: IFeatureController;

    constructor(
        rewardVoteCount: number,
        unstakeVoteCount: number,
        stakeRewardPercent: number,
        referralPercentPerLevel: Array<number>,
        percentCalculator: IStakeRewardPercentCalculator,
        arpFeatureController: IFeatureController,
    ) {
        this.rewardVoteCount = rewardVoteCount;
        this.unstakeVoteCount = unstakeVoteCount;
        this.percentCalculator = percentCalculator;
        this.stakeRewardPercent = stakeRewardPercent;
        this.referralPercentPerLevel = referralPercentPerLevel;
        this.arpFeatureController = arpFeatureController;
    }

    calculateTotalRewardAndUnstake(
        createdAt: Timestamp,
        stakes: Array<Stake>,
        voteType: VoteType,
        lastBlockHeight: number,
    ): StakeReward {
        let reward: number = 0;
        let unstake: number = 0;

        if (voteType === VoteType.DOWN_VOTE) {
            return { reward, unstake };
        }

        stakes
            .filter(stake => stake.isActive && createdAt >= stake.nextVoteMilestone)
            .forEach((stake: StakeSchema) => {
                const nextVoteCount = stake.voteCount + 1;
                console.log('lastBlockHeight', lastBlockHeight);
                if (stake.voteCount > 0 && nextVoteCount % this.rewardVoteCount === 0) {
                    const stakeRewardPercent = this.percentCalculator.calculatePercent(lastBlockHeight);
                    console.log('stakeRewardPercent', stakeRewardPercent);
                    reward += stake.amount * stakeRewardPercent;
                }
                if (nextVoteCount === this.unstakeVoteCount) {
                    unstake += stake.amount;
                }
            });

        if (this.arpFeatureController.isEnabled(lastBlockHeight)) {
            reward = Math.ceil(reward);
        }
        console.log(reward, unstake);
        return { reward, unstake };
    }

    calculateAirdropReward(
        sender: Account,
        amount: number,
        transactionType: TransactionType,
        availableAirdropBalance: number,
    ): AirdropReward {
        const airdropReward: AirdropReward = {
            sponsors: new Map<Address, number>(),
        };

        if (!amount || !sender || !sender.referrals || sender.referrals.length === 0) {
            return airdropReward;
        }

        const referrals: Array<BigInt> = [];
        if (transactionType === TransactionType.STAKE) {
            referrals.push(sender.referrals[0]);
        } else {
            referrals.push(...sender.referrals);
        }

        let airdropRewardAmount: number = 0;
        referrals.forEach((referral: BigInt, i: number) => {
            const reward = transactionType === TransactionType.STAKE
                ? Math.ceil(amount * this.stakeRewardPercent)
                : Math.ceil(this.referralPercentPerLevel[i] * amount);
            airdropReward.sponsors.set(referral, reward);
            airdropRewardAmount += reward;
        });

        if (availableAirdropBalance < airdropRewardAmount) {
            return { sponsors: new Map<Address, number>() };
        }

        return airdropReward;
    }
}

export const initRewardCalculator = (config: ConfigSchema): IRewardCalculator => {
    return new RewardCalculator(
        config.STAKE.REWARD_VOTE_COUNT,
        config.STAKE.UNSTAKE_VOTE_COUNT,
        config.AIRDROP.STAKE_REWARD_PERCENT,
        config.AIRDROP.REFERRAL_PERCENT_PER_LEVEL,
        new StakeRewardPercentCalculator(
            config.STAKE.REWARDS.MILESTONES,
            config.STAKE.REWARDS.DISTANCE,
        ),
        new FeatureController(config.ARP.ENABLED_BLOCK_HEIGHT),
    );
};
