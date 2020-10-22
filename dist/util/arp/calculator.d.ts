import { Account } from '../../model/common/account';
import { AirdropReward } from '../../model/common/type';
export interface IARPCalculator {
    calculate(sender: Account, amount: number, availableAirdropBalance: number): AirdropReward;
}
export declare class ARPCalculator implements IARPCalculator {
    private readonly rewardPercentPerLevel;
    private readonly minActiveStakeAmountForReceive;
    constructor(rewardPercentPerLevel: Array<number>, minActiveStakeAmountForReceive: number);
    calculate(sender: Account, amount: number, availableAirdropBalance: number): AirdropReward;
}
