import { Address, PublicKey } from './type';
import { Delegate, DelegateSchema } from './delegate';
import { Stake, StakeSchema } from './transaction/stake';
import { Airdrop, AirdropSchema } from './airdrop';
export declare type AccountSchema = {
    publicKey?: PublicKey;
    actualBalance?: number;
    votes?: Array<PublicKey>;
    referrals?: Array<BigInt>;
    stakes?: Array<StakeSchema>;
    secondPublicKey?: PublicKey;
    delegate?: DelegateSchema;
    address?: Address;
    arp?: AirdropSchema;
};
export declare class Account implements AccountSchema {
    address: Address;
    publicKey: PublicKey;
    secondPublicKey: PublicKey;
    actualBalance: number;
    delegate: Delegate;
    votes: Array<PublicKey>;
    referrals: Array<BigInt>;
    stakes: Array<Stake>;
    arp?: Airdrop;
    constructor(data: AccountSchema);
    getAllStakes: () => Stake[];
    getActiveStakes: () => Stake[];
    getARPActiveStakes: () => Stake[];
    getTotalStakeAmount: () => number;
}
