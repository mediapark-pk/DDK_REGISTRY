import { AirdropReward } from '../../model/common/type';
export declare const createAirdropReward: (sponsors?: Map<BigInt, number>) => AirdropReward;
export declare const calculateTotalAirdropReward: (airdrop: AirdropReward) => number;
