"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const util_1 = require("./arp/util");
const type_1 = require("../model/common/type");
const type_2 = require("../model/common/transaction/type");
exports.mergeAirdrops = (...airdrops) => {
    const mergedAirdrop = util_1.createAirdropReward();
    airdrops.forEach(airdrop => {
        airdrop.sponsors.forEach((reward, address) => {
            const currentReward = mergedAirdrop.sponsors.get(address) || 0;
            mergedAirdrop.sponsors.set(address, reward + currentReward);
        });
    });
    return mergedAirdrop;
};
exports.calculateAirdropReward = (trs, amount, sender, lastBlockHeight, availableAirdropBalance, isARPEnabled) => {
    switch (trs.type) {
        case type_2.TransactionType.STAKE:
            if (isARPEnabled) {
                return __1.default.stakeARPCalculator.calculate(sender, amount, availableAirdropBalance);
            }
            return __1.default.rewardCalculator.calculateAirdropReward(sender, amount, type_2.TransactionType.STAKE, availableAirdropBalance);
        case type_2.TransactionType.VOTE:
            const isDownVote = trs.asset.votes[0][0] === '-';
            const voteType = isDownVote ? type_1.VoteType.DOWN_VOTE : type_1.VoteType.VOTE;
            if (isARPEnabled) {
                const arpTotalReward = __1.default.rewardCalculator
                    .calculateTotalRewardAndUnstake(trs.createdAt, sender.arp.stakes, voteType, lastBlockHeight);
                return __1.default.voteARPCalculator.calculate(sender, arpTotalReward.reward, availableAirdropBalance);
            }
            const totalReward = __1.default.rewardCalculator
                .calculateTotalRewardAndUnstake(trs.createdAt, sender.stakes, voteType, lastBlockHeight);
            return __1.default.rewardCalculator.calculateAirdropReward(sender, totalReward.reward, type_2.TransactionType.VOTE, availableAirdropBalance);
        default:
            break;
    }
    return util_1.createAirdropReward();
};
