import { Account, AccountSchema } from './account';
export declare type DelegateSchema = {
    username: string;
    missedBlocks: number;
    forgedBlocks: number;
    account: AccountSchema;
    votes: number;
    confirmedVoteCount: number;
    approval: number;
};
export declare class Delegate {
    username: string;
    missedBlocks: number;
    forgedBlocks: number;
    account: Account;
    votes: number;
    confirmedVoteCount: number;
    approval: number;
    constructor(data: DelegateSchema);
}
export declare enum ForgeStatus {
    WAITING = "WAITING",
    FORGING = "FORGING",
    FORGED = "FORGED",
    MISSED = "MISSED"
}
export declare type ActiveDelegate = Delegate & {
    slotNumber: number;
    status: ForgeStatus;
};
