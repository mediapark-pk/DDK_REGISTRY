import { Account } from '../../model/common/account';
import { AirdropReward } from '../../model/common/type';
import { StakeSchema } from '../../model/common/transaction/stake';
import { createAirdropReward } from './util';
import DDK from '../../index';

export interface IARPCalculator {
    calculate(
        sender: Account,
        amount: number,
        availableAirdropBalance: number,
    ): AirdropReward;
}

export class ARPCalculator implements IARPCalculator {
    constructor(
        private readonly rewardPercentPerLevel: Array<number>,
        private readonly minActiveStakeAmountForReceive: number,
    ) { }

    calculate(
        sender: Account,
        amount: number,
        availableAirdropBalance: number,
    ): AirdropReward {
        const airdropReward = createAirdropReward();

        if (
            !amount ||
            !availableAirdropBalance ||
            !sender ||
            !Array.isArray(sender.arp.referrals) ||
            sender.arp.referrals.length === 0
        ) {
            return airdropReward;
        }

        let totalReward = 0;
        this.rewardPercentPerLevel.forEach((rewardPercent: number, index: number) => {
            const referrer = DDK.accountRepository.getByAddress(sender.arp.referrals[index]);
            if (!referrer) {
                return;
            }

            const referrerActiveStakeAmount = referrer.arp.stakes.reduce((sum: number, stake: StakeSchema) => {
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
            return createAirdropReward();
        }

        return airdropReward;
    }
}
