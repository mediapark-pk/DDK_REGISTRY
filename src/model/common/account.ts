import { Address, PublicKey } from './type';
import { Delegate, DelegateSchema } from './delegate';
import { Stake, StakeSchema } from './transaction/stake';
import { getAddressByPublicKey } from '../../util/account';
import { Airdrop, AirdropSchema } from './airdrop';

export type AccountSchema = {
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

export class Account implements AccountSchema {
    address: Address;
    publicKey: PublicKey;
    secondPublicKey: PublicKey;
    actualBalance: number;
    delegate: Delegate;
    votes: Array<PublicKey>;
    referrals: Array<BigInt>;
    stakes: Array<Stake>;
    arp?: Airdrop;

    constructor(data: AccountSchema) {
        this.publicKey = data.publicKey;
        this.actualBalance = data.actualBalance || 0;
        this.address = data.address || getAddressByPublicKey(data.publicKey);
        this.secondPublicKey = data.secondPublicKey;

        if (data.delegate) {
            this.delegate = new Delegate({ ...data.delegate, account: this });
        }

        this.votes = data.votes || [];
        this.referrals = data.referrals || [];
        this.stakes = (data.stakes || []).map(item => new Stake({ ...item }));
        this.arp = new Airdrop(data.arp);
    }

    getAllStakes = (): Array<Stake> => {
        return [...this.stakes, ...this.arp.stakes];
    }

    getActiveStakes = (): Array<Stake> => {
        return this.getAllStakes().filter(stake => stake.isActive);
    }

    getARPActiveStakes = (): Array<Stake> => {
        return this.arp.stakes.filter(stake => stake.isActive);
    }

    getTotalStakeAmount = (): number => {
        return this.getAllStakes().reduce((acc: number, stake: Stake) => {
            if (stake.isActive) {
                acc += stake.amount;
            }
            return acc;
        }, 0);
    }
}
