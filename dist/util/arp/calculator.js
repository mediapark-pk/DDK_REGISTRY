"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const index_1 = __importDefault(require("../../index"));
class ARPCalculator {
    constructor(rewardPercentPerLevel, minActiveStakeAmountForReceive) {
        this.rewardPercentPerLevel = rewardPercentPerLevel;
        this.minActiveStakeAmountForReceive = minActiveStakeAmountForReceive;
    }
    calculate(sender, amount, availableAirdropBalance) {
        const airdropReward = util_1.createAirdropReward();
        if (!amount ||
            !availableAirdropBalance ||
            !sender ||
            !Array.isArray(sender.arp.referrals) ||
            sender.arp.referrals.length === 0) {
            return airdropReward;
        }
        let totalReward = 0;
        this.rewardPercentPerLevel.forEach((rewardPercent, index) => {
            const referrer = index_1.default.accountRepository.getByAddress(sender.arp.referrals[index]);
            if (!referrer) {
                return;
            }
            const referrerActiveStakeAmount = referrer.arp.stakes.reduce((sum, stake) => {
                if (stake.isActive) {
                    return sum + stake.amount;
                }
                return sum;
            }, 0);
            if (referrerActiveStakeAmount < this.minActiveStakeAmountForReceive) {
                return;
            }
            const reward = Math.ceil(amount * rewardPercent);
            totalReward += reward;
            airdropReward.sponsors.set(referrer.address, reward);
        });
        if (availableAirdropBalance < totalReward) {
            return util_1.createAirdropReward();
        }
        return airdropReward;
    }
}
exports.ARPCalculator = ARPCalculator;
