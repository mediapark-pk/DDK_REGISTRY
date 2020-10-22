import { Stake, StakeSchema } from './transaction/stake';

export enum AirdropType {
    AIRDROP = 'airdrop',
    ARP = 'arp'
}

export type AirdropSchema = {
    referrals?: Array<BigInt>;
    stakes?: Array<StakeSchema>;
};

export class Airdrop {
    referrals: Array<BigInt>;
    stakes: Array<Stake>;

    constructor(data?: AirdropSchema) {
        this.referrals = [];
        this.stakes = [];

        if (data && Array.isArray(data.referrals)) {
            this.referrals = data.referrals;
        }

        if (data && Array.isArray(data.stakes)) {
            this.stakes = data.stakes.map(item => new Stake({ ...item }));
        }
    }
}
