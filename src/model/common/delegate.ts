import { Account, AccountSchema } from './account';

export type DelegateSchema = {
    username: string;
    missedBlocks: number;
    forgedBlocks: number;
    account: AccountSchema;
    votes: number;
    confirmedVoteCount: number;
    approval: number;
};

export class Delegate {
    username: string;
    missedBlocks: number;
    forgedBlocks: number;
    account: Account;
    votes: number;
    confirmedVoteCount: number;
    approval: number;

    constructor(data: DelegateSchema) {
        this.username = data.username;
        this.missedBlocks = data.missedBlocks;
        this.forgedBlocks = data.forgedBlocks;
        this.account = data.account instanceof Account
            ? data.account
            : new Account(data.account);
        this.votes = data.votes;
        this.confirmedVoteCount = data.confirmedVoteCount;
        this.approval = data.approval || 0;
    }
}

export enum ForgeStatus {
    WAITING = 'WAITING',
    FORGING = 'FORGING',
    FORGED = 'FORGED',
    MISSED = 'MISSED',
}

export type ActiveDelegate = Delegate & {
    slotNumber: number,
    status: ForgeStatus,
};
