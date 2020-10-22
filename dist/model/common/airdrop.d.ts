import { Stake, StakeSchema } from './transaction/stake';
export declare enum AirdropType {
    AIRDROP = "airdrop",
    ARP = "arp"
}
export declare type AirdropSchema = {
    referrals?: Array<BigInt>;
    stakes?: Array<StakeSchema>;
};
export declare class Airdrop {
    referrals: Array<BigInt>;
    stakes: Array<Stake>;
    constructor(data?: AirdropSchema);
}
