import { Account } from '../../model/common/account';
import { Timestamp } from '../../model/common/type';
import { AssetStake } from '../../model/common/transaction/asset/stake';
export declare type StakeData = {
    startTime: Timestamp;
    amount: number;
    startVoteCount?: number;
};
export declare const createOldAssetStake: (data: StakeData, sender: Account, availableAirdropBalance: number) => AssetStake;
export declare const createAssetStake: (data: StakeData, sender: Account, lastBlockHeight: number, availableAirdropBalance: number, availableARPBalance: number) => AssetStake;
