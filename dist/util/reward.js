"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = require("../model/common/transaction/type");
const type_2 = require("../model/common/type");
const feature_1 = require("./feature");
class StakeRewardPercentCalculator {
    constructor(milestones, distance) {
        this.milestones = milestones;
        this.distance = distance;
    }
    calculateMilestone(height) {
        if (height <= 3153600) {
            return 0.1;
        }
        else if (height > 3153600 && height <= 6307119) {
            return 0.08;
        }
        else if (height > 6307119 && height < 7883999) {
            return 0.06;
        }
        else if (height > 7883999 && height < 9460799) {
            return 0.04;
        }
        else {
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
    calculatePercent(height) {
        console.log('height in calculatePercent', height);
        const milestones = this.calculateMilestone(height);
        console.log('calcualte percent', milestones);
        return milestones;
    }
}
exports.StakeRewardPercentCalculator = StakeRewardPercentCalculator;
class RewardCalculator {
    constructor(rewardVoteCount, unstakeVoteCount, stakeRewardPercent, referralPercentPerLevel, percentCalculator, arpFeatureController) {
        this.rewardVoteCount = rewardVoteCount;
        this.unstakeVoteCount = unstakeVoteCount;
        this.percentCalculator = percentCalculator;
        this.stakeRewardPercent = stakeRewardPercent;
        this.referralPercentPerLevel = referralPercentPerLevel;
        this.arpFeatureController = arpFeatureController;
    }
    calculateTotalRewardAndUnstake(createdAt, stakes, voteType, lastBlockHeight) {
        let reward = 0;
        let unstake = 0;
        if (voteType === type_2.VoteType.DOWN_VOTE) {
            return { reward, unstake };
        }
        stakes
            .filter(stake => stake.isActive && createdAt >= stake.nextVoteMilestone)
            .forEach((stake) => {
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
    calculateAirdropReward(sender, amount, transactionType, availableAirdropBalance) {
        const airdropReward = {
            sponsors: new Map(),
        };
        if (!amount || !sender || !sender.referrals || sender.referrals.length === 0) {
            return airdropReward;
        }
        const referrals = [];
        if (transactionType === type_1.TransactionType.STAKE) {
            referrals.push(sender.referrals[0]);
        }
        else {
            referrals.push(...sender.referrals);
        }
        let airdropRewardAmount = 0;
        referrals.forEach((referral, i) => {
            const reward = transactionType === type_1.TransactionType.STAKE
                ? Math.ceil(amount * this.stakeRewardPercent)
                : Math.ceil(this.referralPercentPerLevel[i] * amount);
            airdropReward.sponsors.set(referral, reward);
            airdropRewardAmount += reward;
        });
        if (availableAirdropBalance < airdropRewardAmount) {
            return { sponsors: new Map() };
        }
        return airdropReward;
    }
}
exports.RewardCalculator = RewardCalculator;
exports.initRewardCalculator = (config) => {
    return new RewardCalculator(config.STAKE.REWARD_VOTE_COUNT, config.STAKE.UNSTAKE_VOTE_COUNT, config.AIRDROP.STAKE_REWARD_PERCENT, config.AIRDROP.REFERRAL_PERCENT_PER_LEVEL, new StakeRewardPercentCalculator(config.STAKE.REWARDS.MILESTONES, config.STAKE.REWARDS.DISTANCE), new feature_1.FeatureController(config.ARP.ENABLED_BLOCK_HEIGHT));
};
