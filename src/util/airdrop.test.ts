import { expect } from 'chai';

import DDK from '..';
import { createAirdropReward } from './arp/util';
import { mergeAirdrops, calculateAirdropReward } from './airdrop';
import { isEqualMaps } from './map';
import { Account } from '../model/common/account';
import { COIN_MULTIPLIER } from '../config/const';
import { TransactionType } from '../model/common/transaction/type';
import { TransactionSchema } from '../model/common/transaction';
import { Address, AirdropReward } from '../model/common/type';
import { WORKSPACE } from '../config';
import { IAccountRepository, AccountRepository } from '../repository/account';

describe('Airdrop util', () => {
    let accountRepository: IAccountRepository;

    beforeEach(() => {
        accountRepository = new AccountRepository();

        DDK.initialize(WORKSPACE.MAINNET, accountRepository);

        MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE_DIRECT_REWARD =
            DDK.config.ARP.DIRECT_REWARD.MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE;
        MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE_CHAIN_REWARD =
            DDK.config.ARP.CHAIN_REWARD.MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE;
    });

    let MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE_DIRECT_REWARD: number;
    let MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE_CHAIN_REWARD: number;

    it('Merge 2 airdrops', () => {
        const airdrop1 = createAirdropReward();
        const airdrop2 = createAirdropReward();

        airdrop1.sponsors.set(BigInt('1'), 2);
        airdrop2.sponsors.set(BigInt('3'), 4);

        airdrop1.sponsors.set(BigInt('5'), 10);
        airdrop2.sponsors.set(BigInt('5'), 40);

        const mergedAirdrop = mergeAirdrops(airdrop1, airdrop2);

        const expectedAirdrop = createAirdropReward();
        expectedAirdrop.sponsors.set(BigInt('1'), 2);
        expectedAirdrop.sponsors.set(BigInt('5'), 50);
        expectedAirdrop.sponsors.set(BigInt('3'), 4);

        expect(expectedAirdrop).to.eql(mergedAirdrop);
        expect(isEqualMaps(expectedAirdrop.sponsors, mergedAirdrop.sponsors)).to.equal(true);
    });

    it('Calculate airdrop reward for stake transaction before ARP', () => {
        const referrals = [
            new Account({
                publicKey: '0000000000000000000000000000000000000000000000000000000000000000',
                arp: {
                    stakes: [
                        {
                            airdropReward: createAirdropReward(),
                            amount: 1 * COIN_MULTIPLIER,
                            createdAt: 110650921,
                            isActive: true,
                            nextVoteMilestone: 110585266,
                            sourceTransactionId: Buffer.from(
                                'd62ec106d1ee4d6c631e8d55b4df178b834cee52f1ff8667dd64cffe4727dd51', 'hex'),
                            voteCount: 0,
                        },
                    ],
                },
            }),
            new Account({
                publicKey: '0000000000000000000000000000000000000000000000000000000000000001',
                arp: {
                    stakes: [
                        {
                            airdropReward: createAirdropReward(),
                            amount: 1 * COIN_MULTIPLIER,
                            createdAt: 110650921,
                            isActive: true,
                            nextVoteMilestone: 110585266,
                            sourceTransactionId: Buffer.from(
                                'd62ec106d1ee4d6c631e8d55b4df178b834cee52f1ff8667dd64cffe4727dd51', 'hex'),
                            voteCount: 0,
                        },
                    ],
                },
            }),
        ];

        const arpReferrals = [
            new Account({
                publicKey: '0000000000000000000000000000000000000000000000000000000000000002',
                arp: {
                    stakes: [
                        {
                            airdropReward: createAirdropReward(),
                            amount: MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE_DIRECT_REWARD * COIN_MULTIPLIER,
                            createdAt: 110650921,
                            isActive: true,
                            nextVoteMilestone: 110585266,
                            sourceTransactionId: Buffer.from(
                                'd62ec106d1ee4d6c631e8d55b4df178b834cee52f1ff8667dd64cffe4727dd51', 'hex'),
                            voteCount: 0,
                        },
                    ],
                },
            }),
            new Account({
                publicKey: '0000000000000000000000000000000000000000000000000000000000000003',
                arp: {
                    stakes: [
                        {
                            airdropReward: createAirdropReward(),
                            amount: MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE_DIRECT_REWARD * COIN_MULTIPLIER,
                            createdAt: 110650921,
                            isActive: true,
                            nextVoteMilestone: 110585266,
                            sourceTransactionId: Buffer.from(
                                'd62ec106d1ee4d6c631e8d55b4df178b834cee52f1ff8667dd64cffe4727dd51', 'hex'),
                            voteCount: 0,
                        },
                    ],
                },
            }),
        ];

        referrals.forEach(referral => accountRepository.add(referral));
        arpReferrals.forEach(referral => accountRepository.add(referral));

        const sender = new Account({
            actualBalance: 4112952030480000,
            publicKey: 'f4ae589b02f97e9ab5bce61cf187bcc96cfb3fdf9a11333703a682b7d47c8dc2',
            referrals: referrals.map(referral => referral.address),
            arp: {
                referrals: arpReferrals.map(referral => referral.address),
            }
        });

        const actualAirdropReward = calculateAirdropReward(
            { type: TransactionType.STAKE } as TransactionSchema<any>,
            1 * COIN_MULTIPLIER,
            sender,
            1,
            Infinity,
            false,
        );

        const expectedAirdropReward: AirdropReward = {
            sponsors: new Map<Address, number>()
                .set(BigInt('8628161281313630310'), 10000000),
        };

        expect(expectedAirdropReward).to.deep.equal(actualAirdropReward);
    });

    it('Calculate airdrop reward for stake transaction after ARP', () => {
        const referrals = [
            new Account({
                publicKey: '0000000000000000000000000000000000000000000000000000000000000000',
                arp: {
                    stakes: [
                        {
                            airdropReward: createAirdropReward(),
                            amount: 1 * COIN_MULTIPLIER,
                            createdAt: 110650921,
                            isActive: true,
                            nextVoteMilestone: 110585266,
                            sourceTransactionId: Buffer.from(
                                'd62ec106d1ee4d6c631e8d55b4df178b834cee52f1ff8667dd64cffe4727dd51', 'hex'),
                            voteCount: 0,
                        },
                    ],
                },
            }),
            new Account({
                publicKey: '0000000000000000000000000000000000000000000000000000000000000001',
                arp: {
                    stakes: [
                        {
                            airdropReward: createAirdropReward(),
                            amount: 1 * COIN_MULTIPLIER,
                            createdAt: 110650921,
                            isActive: true,
                            nextVoteMilestone: 110585266,
                            sourceTransactionId: Buffer.from(
                                'd62ec106d1ee4d6c631e8d55b4df178b834cee52f1ff8667dd64cffe4727dd51', 'hex'),
                            voteCount: 0,
                        },
                    ],
                },
            }),
        ];
        const arpReferrals = [
            new Account({
                publicKey: '0000000000000000000000000000000000000000000000000000000000000002',
                arp: {
                    stakes: [
                        {
                            airdropReward: createAirdropReward(),
                            amount: MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE_DIRECT_REWARD * COIN_MULTIPLIER,
                            createdAt: 110650921,
                            isActive: true,
                            nextVoteMilestone: 110585266,
                            sourceTransactionId: Buffer.from(
                                'd62ec106d1ee4d6c631e8d55b4df178b834cee52f1ff8667dd64cffe4727dd51', 'hex'),
                            voteCount: 0,
                        },
                    ],
                },
            }),
            new Account({
                publicKey: '0000000000000000000000000000000000000000000000000000000000000003',
                arp: {
                    stakes: [
                        {
                            airdropReward: createAirdropReward(),
                            amount: MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE_DIRECT_REWARD * COIN_MULTIPLIER,
                            createdAt: 110650921,
                            isActive: true,
                            nextVoteMilestone: 110585266,
                            sourceTransactionId: Buffer.from(
                                'd62ec106d1ee4d6c631e8d55b4df178b834cee52f1ff8667dd64cffe4727dd51', 'hex'),
                            voteCount: 0,
                        },
                    ],
                },
            }),
            new Account({
                publicKey: '0000000000000000000000000000000000000000000000000000000000000004',
                arp: {
                    stakes: [
                        {
                            airdropReward: createAirdropReward(),
                            amount: MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE_DIRECT_REWARD * COIN_MULTIPLIER,
                            createdAt: 110650921,
                            isActive: true,
                            nextVoteMilestone: 110585266,
                            sourceTransactionId: Buffer.from(
                                'd62ec106d1ee4d6c631e8d55b4df178b834cee52f1ff8667dd64cffe4727dd51', 'hex'),
                            voteCount: 0,
                        },
                    ],
                },
            }),
            new Account({
                publicKey: '0000000000000000000000000000000000000000000000000000000000000005',
                arp: {
                    stakes: [
                        {
                            airdropReward: createAirdropReward(),
                            amount: MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE_DIRECT_REWARD * COIN_MULTIPLIER,
                            createdAt: 110650921,
                            isActive: true,
                            nextVoteMilestone: 110585266,
                            sourceTransactionId: Buffer.from(
                                'd62ec106d1ee4d6c631e8d55b4df178b834cee52f1ff8667dd64cffe4727dd51', 'hex'),
                            voteCount: 0,
                        },
                    ],
                },
            }),
        ];

        referrals.forEach(referral => accountRepository.add(referral));
        arpReferrals.forEach(referral => accountRepository.add(referral));

        const sender = new Account({
            actualBalance: 4112952030480000,
            publicKey: 'f4ae589b02f97e9ab5bce61cf187bcc96cfb3fdf9a11333703a682b7d47c8dc2',
            referrals: referrals.map(referral => referral.address),
            arp: {
                referrals: arpReferrals.map(referral => referral.address),
            }
        });

        const actualAirdropReward = calculateAirdropReward(
            { type: TransactionType.STAKE } as TransactionSchema<any>,
            1 * COIN_MULTIPLIER,
            sender,
            Infinity,
            Infinity,
            true,
        );

        const expectedAirdropReward: AirdropReward = {
            sponsors: new Map<Address, number>()
                .set(BigInt('4695425845594122130'), 5000000)
                .set(BigInt('17601308981789791449'), 3000000)
                .set(BigInt('10953032228892871139'), 2000000),
        };

        expect(expectedAirdropReward).to.deep.equal(actualAirdropReward);
    });

    it('Calculate airdrop reward for vote transaction before ARP', () => {
        const referrals = [
            new Account({
                publicKey: '1aa981869d400a578c11c6dd0d65fa89a21557db44e5d876dcd0cc461db1bfd2',
            }),
            new Account({
                publicKey: '0e37278dff7764749608e1ae6b186c5dae8fd388ca325ce5965f095c01e1dd0b',
            }),
            new Account({
                publicKey: '702184b93831f9c749898c16853875da3684c11b75532deecce3adaffd86632d',
            }),
            new Account({
                publicKey: '3306e3072dd8ec2f5af6fb0aabf55a561a96bfdf6ce8fb0bcbd19d50a1865b38',
            }),
            new Account({
                publicKey: '648c8da6f52f8e5b5c31536e8ed61dd18d55d951a7c0382df7279439c11d5457',
            }),
        ];

        const arpReferrals = [
            new Account({
                publicKey: '0000000000000000000000000000000000000000000000000000000000000000',
                arp: {
                    stakes: [
                        {
                            airdropReward: createAirdropReward(),
                            amount: MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE_CHAIN_REWARD * COIN_MULTIPLIER,
                            createdAt: 110650921,
                            isActive: true,
                            nextVoteMilestone: 110585266,
                            sourceTransactionId: Buffer.from(
                                'd62ec106d1ee4d6c631e8d55b4df178b834cee52f1ff8667dd64cffe4727dd51', 'hex'),
                            voteCount: 0,
                        },
                    ],
                },
            }),
            new Account({
                publicKey: '0000000000000000000000000000000000000000000000000000000000000001',
                arp: {
                    stakes: [
                        {
                            airdropReward: createAirdropReward(),
                            amount: MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE_CHAIN_REWARD * COIN_MULTIPLIER,
                            createdAt: 110650921,
                            isActive: true,
                            nextVoteMilestone: 110585266,
                            sourceTransactionId: Buffer.from(
                                'd62ec106d1ee4d6c631e8d55b4df178b834cee52f1ff8667dd64cffe4727dd51', 'hex'),
                            voteCount: 0,
                        },
                    ],
                },
            }),
            new Account({
                publicKey: '0000000000000000000000000000000000000000000000000000000000000002',
                arp: {
                    stakes: [
                        {
                            airdropReward: createAirdropReward(),
                            amount: MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE_CHAIN_REWARD * COIN_MULTIPLIER,
                            createdAt: 110650921,
                            isActive: true,
                            nextVoteMilestone: 110585266,
                            sourceTransactionId: Buffer.from(
                                'd62ec106d1ee4d6c631e8d55b4df178b834cee52f1ff8667dd64cffe4727dd51', 'hex'),
                            voteCount: 0,
                        },
                    ],
                },
            }),
            new Account({
                publicKey: '0000000000000000000000000000000000000000000000000000000000000003',
                arp: {
                    stakes: [
                        {
                            airdropReward: createAirdropReward(),
                            amount: MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE_CHAIN_REWARD * COIN_MULTIPLIER,
                            createdAt: 110650921,
                            isActive: true,
                            nextVoteMilestone: 110585266,
                            sourceTransactionId: Buffer.from(
                                'd62ec106d1ee4d6c631e8d55b4df178b834cee52f1ff8667dd64cffe4727dd51', 'hex'),
                            voteCount: 0,
                        },
                    ],
                },
            }),
            new Account({
                publicKey: '0000000000000000000000000000000000000000000000000000000000000004',
                arp: {
                    stakes: [
                        {
                            airdropReward: createAirdropReward(),
                            amount: MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE_CHAIN_REWARD * COIN_MULTIPLIER,
                            createdAt: 110650921,
                            isActive: true,
                            nextVoteMilestone: 110585266,
                            sourceTransactionId: Buffer.from(
                                'd62ec106d1ee4d6c631e8d55b4df178b834cee52f1ff8667dd64cffe4727dd51', 'hex'),
                            voteCount: 0,
                        },
                    ],
                },
            }),
        ];

        referrals.forEach(referral => accountRepository.add(referral));
        arpReferrals.forEach(referral => accountRepository.add(referral));

        const sender = new Account({
            actualBalance: 4112952030480000,
            publicKey: 'f4ae589b02f97e9ab5bce61cf187bcc96cfb3fdf9a11333703a682b7d47c8dc2',
            referrals: referrals.map(referral => referral.address),
            stakes: [
                {
                    airdropReward: createAirdropReward(),
                    amount: 400000000,
                    createdAt: 111767077,
                    isActive: true,
                    nextVoteMilestone: 110585266,
                    sourceTransactionId: Buffer.from(
                        '7b1b505edec73657d5fdc187671cb212b9b699500aa54e1f81a5864374cb7fbd', 'hex'),
                    voteCount: 23,
                },
                {
                    airdropReward: createAirdropReward(),
                    amount: 200000000,
                    createdAt: 111687376,
                    isActive: true,
                    nextVoteMilestone: 110585266,
                    sourceTransactionId: Buffer.from(
                        '7b1b505edec73657d5fdc187671cb212b9b699500aa54e1f81a5864374cb7fbd', 'hex'),
                    voteCount: 3,
                },
                {
                    airdropReward: createAirdropReward(),
                    amount: 200000000,
                    createdAt: 110650921,
                    isActive: false,
                    nextVoteMilestone: 110585266,
                    sourceTransactionId: Buffer.from(
                        'd62ec106d1ee4d6c631e8d55b4df178b834cee52f1ff8667dd64cffe4727dd51', 'hex'),
                    voteCount: 4,
                },
                {
                    airdropReward: createAirdropReward(),
                    amount: 100000000,
                    createdAt: 110650918,
                    isActive: false,
                    nextVoteMilestone: 110585266,
                    sourceTransactionId: Buffer.from(
                        '80a59a608317621e98b00ebf19d65376f7ef9dd35bcee2fc448c3d230d915cd9', 'hex'),
                    voteCount: 4,
                },
            ],
            arp: {
                stakes: [
                    {
                        airdropReward: createAirdropReward(),
                        amount: 100 * COIN_MULTIPLIER,
                        createdAt: 111687376,
                        isActive: true,
                        nextVoteMilestone: 110585266,
                        sourceTransactionId: Buffer.from(
                            '7b1b505edec73657d5fdc187671cb212b9b699500aa54e1f81a5864374cb7fbe', 'hex'),
                        voteCount: 3,
                    },
                    {
                        airdropReward: createAirdropReward(),
                        amount: 100 * COIN_MULTIPLIER,
                        createdAt: 111767077,
                        isActive: true,
                        nextVoteMilestone: 110585266,
                        sourceTransactionId: Buffer.from(
                            '7b1b505edec73657d5fdc187671cb212b9b699500aa54e1f81a5864374cb7fbc', 'hex'),
                        voteCount: 23,
                    },
                ],
                referrals: arpReferrals.map(referral => referral.address),
            },
        });

        const actualAirdropReward = calculateAirdropReward(
            {
                type: TransactionType.VOTE,
                asset: { votes: ['+'] },
                createdAt: 111796273,
            } as TransactionSchema<any>,
            0,
            sender,
            1,
            Infinity,
            false,
        );

        const expectedAirdropReward: AirdropReward = {
            sponsors: new Map<Address, number>()
                .set(BigInt('16980293496863192173'), 3000000)
                .set(BigInt('10577313357240767744'), 1800000)
                .set(BigInt('13348365708182703460'), 1200000)
                .set(BigInt('858063025382772148'), 1200000)
                .set(BigInt('10759421590558995180'), 600000),
        };

        expect(expectedAirdropReward).to.deep.equal(actualAirdropReward);
    });

    it('Calculate airdrop reward for vote transaction after ARP', () => {
        const referrals = [
            new Account({
                publicKey: '1aa981869d400a578c11c6dd0d65fa89a21557db44e5d876dcd0cc461db1bfd2',
            }),
            new Account({
                publicKey: '0e37278dff7764749608e1ae6b186c5dae8fd388ca325ce5965f095c01e1dd0b',
            }),
            new Account({
                publicKey: '702184b93831f9c749898c16853875da3684c11b75532deecce3adaffd86632d',
            }),
            new Account({
                publicKey: '3306e3072dd8ec2f5af6fb0aabf55a561a96bfdf6ce8fb0bcbd19d50a1865b38',
            }),
            new Account({
                publicKey: '648c8da6f52f8e5b5c31536e8ed61dd18d55d951a7c0382df7279439c11d5457',
            }),
        ];

        const arpReferrals = [
            new Account({
                publicKey: '0000000000000000000000000000000000000000000000000000000000000000',
                arp: {
                    stakes: [
                        {
                            airdropReward: createAirdropReward(),
                            amount: MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE_CHAIN_REWARD * COIN_MULTIPLIER,
                            createdAt: 110650921,
                            isActive: true,
                            nextVoteMilestone: 110585266,
                            sourceTransactionId: Buffer.from(
                                'd62ec106d1ee4d6c631e8d55b4df178b834cee52f1ff8667dd64cffe4727dd51', 'hex'),
                            voteCount: 0,
                        },
                    ],
                },
            }),
            new Account({
                publicKey: '0000000000000000000000000000000000000000000000000000000000000001',
                arp: {
                    stakes: [
                        {
                            airdropReward: createAirdropReward(),
                            amount: MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE_CHAIN_REWARD * COIN_MULTIPLIER,
                            createdAt: 110650921,
                            isActive: true,
                            nextVoteMilestone: 110585266,
                            sourceTransactionId: Buffer.from(
                                'd62ec106d1ee4d6c631e8d55b4df178b834cee52f1ff8667dd64cffe4727dd51', 'hex'),
                            voteCount: 0,
                        },
                    ],
                },
            }),
            new Account({
                publicKey: '0000000000000000000000000000000000000000000000000000000000000002',
                arp: {
                    stakes: [
                        {
                            airdropReward: createAirdropReward(),
                            amount: MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE_CHAIN_REWARD * COIN_MULTIPLIER,
                            createdAt: 110650921,
                            isActive: true,
                            nextVoteMilestone: 110585266,
                            sourceTransactionId: Buffer.from(
                                'd62ec106d1ee4d6c631e8d55b4df178b834cee52f1ff8667dd64cffe4727dd51', 'hex'),
                            voteCount: 0,
                        },
                    ],
                },
            }),
            new Account({
                publicKey: '0000000000000000000000000000000000000000000000000000000000000003',
                arp: {
                    stakes: [
                        {
                            airdropReward: createAirdropReward(),
                            amount: MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE_CHAIN_REWARD * COIN_MULTIPLIER,
                            createdAt: 110650921,
                            isActive: true,
                            nextVoteMilestone: 110585266,
                            sourceTransactionId: Buffer.from(
                                'd62ec106d1ee4d6c631e8d55b4df178b834cee52f1ff8667dd64cffe4727dd51', 'hex'),
                            voteCount: 0,
                        },
                    ],
                },
            }),
            new Account({
                publicKey: '0000000000000000000000000000000000000000000000000000000000000004',
                arp: {
                    stakes: [
                        {
                            airdropReward: createAirdropReward(),
                            amount: MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE_CHAIN_REWARD * COIN_MULTIPLIER,
                            createdAt: 110650921,
                            isActive: true,
                            nextVoteMilestone: 110585266,
                            sourceTransactionId: Buffer.from(
                                'd62ec106d1ee4d6c631e8d55b4df178b834cee52f1ff8667dd64cffe4727dd51', 'hex'),
                            voteCount: 0,
                        },
                    ],
                },
            }),
        ];

        referrals.forEach(referral => accountRepository.add(referral));
        arpReferrals.forEach(referral => accountRepository.add(referral));

        const sender = new Account({
            actualBalance: 4112952030480000,
            publicKey: 'f4ae589b02f97e9ab5bce61cf187bcc96cfb3fdf9a11333703a682b7d47c8dc2',
            referrals: referrals.map(referral => referral.address),
            stakes: [
                {
                    airdropReward: createAirdropReward(),
                    amount: 400000000,
                    createdAt: 111767077,
                    isActive: true,
                    nextVoteMilestone: 110585266,
                    sourceTransactionId: Buffer.from(
                        '7b1b505edec73657d5fdc187671cb212b9b699500aa54e1f81a5864374cb7fbd', 'hex'),
                    voteCount: 23,
                },
                {
                    airdropReward: createAirdropReward(),
                    amount: 200000000,
                    createdAt: 111687376,
                    isActive: true,
                    nextVoteMilestone: 110585266,
                    sourceTransactionId: Buffer.from(
                        '7b1b505edec73657d5fdc187671cb212b9b699500aa54e1f81a5864374cb7fbd', 'hex'),
                    voteCount: 3,
                },
                {
                    airdropReward: createAirdropReward(),
                    amount: 200000000,
                    createdAt: 110650921,
                    isActive: false,
                    nextVoteMilestone: 110585266,
                    sourceTransactionId: Buffer.from(
                        'd62ec106d1ee4d6c631e8d55b4df178b834cee52f1ff8667dd64cffe4727dd51', 'hex'),
                    voteCount: 4,
                },
                {
                    airdropReward: createAirdropReward(),
                    amount: 100000000,
                    createdAt: 110650918,
                    isActive: false,
                    nextVoteMilestone: 110585266,
                    sourceTransactionId: Buffer.from(
                        '80a59a608317621e98b00ebf19d65376f7ef9dd35bcee2fc448c3d230d915cd9', 'hex'),
                    voteCount: 4,
                },
            ],
            arp: {
                stakes: [
                    {
                        airdropReward: createAirdropReward(),
                        amount: 100 * COIN_MULTIPLIER,
                        createdAt: 111687376,
                        isActive: true,
                        nextVoteMilestone: 110585266,
                        sourceTransactionId: Buffer.from(
                            '7b1b505edec73657d5fdc187671cb212b9b699500aa54e1f81a5864374cb7fbe', 'hex'),
                        voteCount: 3,
                    },
                    {
                        airdropReward: createAirdropReward(),
                        amount: 100 * COIN_MULTIPLIER,
                        createdAt: 111767077,
                        isActive: true,
                        nextVoteMilestone: 110585266,
                        sourceTransactionId: Buffer.from(
                            '7b1b505edec73657d5fdc187671cb212b9b699500aa54e1f81a5864374cb7fbc', 'hex'),
                        voteCount: 23,
                    },
                ],
                referrals: arpReferrals.map(referral => referral.address),
            },
        });

        const actualAirdropReward = calculateAirdropReward(
            {
                type: TransactionType.VOTE,
                asset: { votes: ['+'] },
                createdAt: 111796273,
            } as TransactionSchema<any>,
            0,
            sender,
            Infinity,
            Infinity,
            true,
        );

        const expectedAirdropReward: AirdropReward = {
            sponsors: new Map<Address, number>()
                .set(BigInt('8628161281313630310'), 100000000)
                .set(BigInt('1174590855274973676'), 60000000)
                .set(BigInt('4695425845594122130'), 40000000)
                .set(BigInt('17601308981789791449'), 40000000)
                .set(BigInt('10953032228892871139'), 20000000),
        };

        expect(expectedAirdropReward).to.deep.equal(actualAirdropReward);
    });
});
