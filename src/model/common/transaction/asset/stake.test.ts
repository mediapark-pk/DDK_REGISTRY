import { expect } from 'chai';

import { AssetStake } from './stake';
import { Address } from '../../type';
import { createAirdropReward } from '../../../../util/arp/util';

describe('Stake asset', () => {
    it('get buffer size with empty airdrop', () => {
        const asset = new AssetStake({
            airdropReward: createAirdropReward(),
            amount: 100000000,
            startTime: 111796273,
            startVoteCount: 0,
        });

        expect(asset.getBytes().length).to.equal(asset.getBufferSize());
    });

    it('get buffer size with airdrop', () => {
        const asset = new AssetStake({
            airdropReward: {
                sponsors: new Map<Address, number>()
                    .set(BigInt('16980293496863192173'), 10000000),
            },
            amount: 100000000,
            startTime: 111796273,
            startVoteCount: 0,
        });

        expect(asset.getBytes().length).to.equal(asset.getBufferSize());
    });

    it('get buffer size with ARP airdrop', () => {
        const asset = new AssetStake({
            airdropReward: {
                sponsors: new Map<Address, number>()
                    .set(BigInt('16980293496863192173'), 10000000)
                    .set(BigInt('16980293496863192172'), 10000000)
                    .set(BigInt('16980293496863192171'), 10000000),
            },
            amount: 100000000,
            startTime: 111796273,
            startVoteCount: 0,
        });

        expect(asset.getBytes().length).to.equal(asset.getBufferSize());
    });

    it('write bytes with empty airdrop', () => {
        const asset = new AssetStake({
            airdropReward: createAirdropReward(),
            amount: 100000000,
            startTime: 111796273,
            startVoteCount: 0,
        });

        const bytes = Buffer.allocUnsafe(asset.getBufferSize());
        asset.writeBytes(bytes, 0);

        const expectedBytes = asset.getBytes();

        expect(expectedBytes).to.eql(bytes);
    });

    it('write bytes with airdrop', () => {
        const asset = new AssetStake({
            airdropReward: {
                sponsors: new Map<Address, number>()
                    .set(BigInt('16980293496863192173'), 10000000),
            },
            amount: 100000000,
            startTime: 111796273,
            startVoteCount: 0,
        });

        const bytes = Buffer.allocUnsafe(asset.getBufferSize());
        asset.writeBytes(bytes, 0);

        const expectedBytes = asset.getBytes();

        expect(expectedBytes).to.eql(bytes);
    });

    it('write bytes with ARP airdrop with 2 referrers', () => {
        const asset = new AssetStake({
            airdropReward: {
                sponsors: new Map<Address, number>()
                    .set(BigInt('16980293496863192173'), 10000000)
                    .set(BigInt('16980293496863192172'), 10000000),
            },
            amount: 100000000,
            startTime: 111796273,
            startVoteCount: 0,
        });

        const bytes = Buffer.allocUnsafe(asset.getBufferSize());
        asset.writeBytes(bytes, 0);

        const expectedBytes = asset.getBytes();

        expect(expectedBytes).to.eql(bytes);
    });

    it('write bytes with ARP airdrop with 3 referrers', () => {
        const asset = new AssetStake({
            airdropReward: {
                sponsors: new Map<Address, number>()
                    .set(BigInt('16980293496863192173'), 10000000)
                    .set(BigInt('16980293496863192172'), 10000000)
                    .set(BigInt('16980293496863192171'), 10000000),
            },
            amount: 100000000,
            startTime: 111796273,
            startVoteCount: 0,
        });

        const bytes = Buffer.allocUnsafe(asset.getBufferSize());
        asset.writeBytes(bytes, 0);

        const expectedBytes = asset.getBytes();

        expect(expectedBytes).to.eql(bytes);
    });
});
