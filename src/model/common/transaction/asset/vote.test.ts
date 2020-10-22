import { expect } from 'chai';

import { AssetVote } from './vote';
import { Address, VoteType } from '../../type';
import { createAirdropReward } from '../../../../util/arp/util';

describe('Vote asset', () => {
    it('get buffer size with empty airdrop', () => {
        const asset = new AssetVote({
            arp: {
                reward: 60000000,
                unstake: 400000000,
                airdropReward: createAirdropReward(),
            },
            airdropReward: createAirdropReward(),
            votes: [
                '+137b9f0f839ab3ecd2146bfecd64d31e127d79431211e352bedfeba5fd61a57a',
                '+83cb3d8641c8e73735cc1b70c915602ffcb6e5a68f14a71056511699050a1a05',
                '+f959e6c8d279c97d3ec5ba993f04ab740a6e50bec4aad75a8a1e7808a6c5eec7',
            ],
            reward: 60000000,
            unstake: 400000000,
            type: VoteType.VOTE,
        });

        expect(asset.getBytes().length).to.equal(asset.getBufferSize());
    });

    it('get buffer size with airdrop', () => {
        const asset = new AssetVote({
            arp: {
                reward: 60000000,
                unstake: 400000000,
                airdropReward: {
                    sponsors: new Map<Address, number>()
                        .set(BigInt('16980293496863192173'), 3000000)
                        .set(BigInt('10577313357240767744'), 1800000)
                        .set(BigInt('13348365708182703460'), 1200000)
                        .set(BigInt('858063025382772148'), 1200000)
                        .set(BigInt('10759421590558995180'), 600000)
                },
            },
            airdropReward: {
                sponsors: new Map<Address, number>()
                    .set(BigInt('16980293496863192173'), 3000000)
                    .set(BigInt('10577313357240767744'), 1800000)
                    .set(BigInt('13348365708182703460'), 1200000)
                    .set(BigInt('858063025382772148'), 1200000)
                    .set(BigInt('10759421590558995180'), 600000),
            },
            votes: [
                '+137b9f0f839ab3ecd2146bfecd64d31e127d79431211e352bedfeba5fd61a57a',
                '+83cb3d8641c8e73735cc1b70c915602ffcb6e5a68f14a71056511699050a1a05',
                '+f959e6c8d279c97d3ec5ba993f04ab740a6e50bec4aad75a8a1e7808a6c5eec7',
            ],
            reward: 60000000,
            unstake: 400000000,
            type: VoteType.VOTE,
        });

        expect(asset.getBytes().length).to.equal(asset.getBufferSize());
    });

    it('write bytes with empty airdrop', () => {
        const asset = new AssetVote({
            arp: {
                reward: 60000000,
                unstake: 400000000,
                airdropReward: createAirdropReward(),
            },
            airdropReward: createAirdropReward(),
            votes: [
                '+137b9f0f839ab3ecd2146bfecd64d31e127d79431211e352bedfeba5fd61a57a',
                '+83cb3d8641c8e73735cc1b70c915602ffcb6e5a68f14a71056511699050a1a05',
                '+f959e6c8d279c97d3ec5ba993f04ab740a6e50bec4aad75a8a1e7808a6c5eec7',
            ],
            reward: 60000000,
            unstake: 400000000,
            type: VoteType.VOTE,
        });

        const bytes = Buffer.allocUnsafe(asset.getBufferSize());
        asset.writeBytes(bytes, 0);

        const expectedBytes = asset.getBytes();

        expect(expectedBytes).to.eql(bytes);
    });

    it('write bytes with airdrop', () => {
        const asset = new AssetVote({
            arp: {
                reward: 60000000,
                unstake: 400000000,
                airdropReward: {
                    sponsors: new Map<Address, number>()
                        .set(BigInt('16980293496863192173'), 3000000)
                        .set(BigInt('10577313357240767744'), 1800000)
                        .set(BigInt('13348365708182703460'), 1200000)
                        .set(BigInt('858063025382772148'), 1200000)
                        .set(BigInt('10759421590558995180'), 600000),
                },
            },
            airdropReward: {
                sponsors: new Map<Address, number>()
                    .set(BigInt('16980293496863192173'), 3000000)
                    .set(BigInt('10577313357240767744'), 1800000)
                    .set(BigInt('13348365708182703460'), 1200000)
                    .set(BigInt('858063025382772148'), 1200000)
                    .set(BigInt('10759421590558995180'), 600000),
            },
            votes: [
                '+137b9f0f839ab3ecd2146bfecd64d31e127d79431211e352bedfeba5fd61a57a',
                '+83cb3d8641c8e73735cc1b70c915602ffcb6e5a68f14a71056511699050a1a05',
                '+f959e6c8d279c97d3ec5ba993f04ab740a6e50bec4aad75a8a1e7808a6c5eec7',
            ],
            reward: 60000000,
            unstake: 400000000,
            type: VoteType.VOTE,
        });

        const bytes = Buffer.allocUnsafe(asset.getBufferSize());
        asset.writeBytes(bytes, 0);

        const expectedBytes = asset.getBytes();

        expect(expectedBytes).to.eql(bytes);
    });
});
