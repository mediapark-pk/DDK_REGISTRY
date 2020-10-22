import { AirdropReward } from '../model/common/type';
import { TransactionSchema } from '../model/common/transaction';
import { AssetStakeSchema } from '../model/common/transaction/asset/stake';
import { AssetVoteSchema } from '../model/common/transaction/asset/vote';
import { Account } from '../model/common/account';
export declare const mergeAirdrops: (...airdrops: AirdropReward[]) => AirdropReward;
export declare const calculateAirdropReward: (trs: TransactionSchema<AssetStakeSchema | AssetVoteSchema>, amount: number, sender: Account, lastBlockHeight: number, availableAirdropBalance: number, isARPEnabled: boolean) => AirdropReward;
