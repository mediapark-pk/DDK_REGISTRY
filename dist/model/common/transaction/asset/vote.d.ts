/// <reference types="node" />
import { Asset } from '.';
import { VoteType, AirdropReward } from '../../type';
import { Account } from '../../account';
export declare type AssetVoteSchema = {
    votes: Array<string>;
    type: VoteType;
    reward: number;
    unstake: number;
    airdropReward: AirdropReward;
    arp?: {
        reward: number;
        unstake: number;
        airdropReward: AirdropReward;
    };
};
export declare class AssetVote extends Asset implements AssetVoteSchema {
    votes: Array<string>;
    type: VoteType;
    reward: number;
    unstake: number;
    airdropReward: AirdropReward;
    arp?: {
        reward: number;
        unstake: number;
        airdropReward: AirdropReward;
    };
    constructor(data: AssetVoteSchema);
    getCopy(): AssetVote;
    private writeARPBytes;
    private getARPBytes;
    getBytes(): Buffer;
    getBufferSize(): number;
    writeBytes(buffer: Buffer, offset: number): number;
    calculateFee(sender: Account): number;
}
