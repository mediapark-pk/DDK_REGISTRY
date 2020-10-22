
import { expect } from 'chai';
import DDK, { WORKSPACE } from '../..';
import { createAirdropReward } from './util';
import { Account } from '../../model/common/account';
import { COIN_MULTIPLIER } from '../../config/const';
import { IAccountRepository, AccountRepository } from '../../repository/account';

describe('ARP Vote', () => {
    let accountRepository: IAccountRepository;

    beforeEach(() => {
        accountRepository = new AccountRepository();

        DDK.initialize(WORKSPACE.MAINNET, accountRepository);
    });

    it('Empty sender', () => {
        const sender: Account = null;
        const availableAirdropBalance = 1000;
        const createdAt = 0;

        const airdropReward = DDK.voteARPCalculator.calculate(sender, availableAirdropBalance, createdAt);
        const expectairdropReward = createAirdropReward();

        expect(expectairdropReward).to.deep.equal(airdropReward);
    });

    it('stakes is empty', () => {
        const sender = new Account({
            publicKey: '',
            address: BigInt('0000000000000000000'),
        });

        const createdAt = 0;
        const availableAirdropBalance = 1000 * COIN_MULTIPLIER;

        const airdropReward = DDK.voteARPCalculator.calculate(sender, availableAirdropBalance, createdAt);
        const expectairdropReward = createAirdropReward();

        expect(expectairdropReward).to.deep.equal(airdropReward);
    });

    it('stake.amount < min', () => {
        const referrerLevel1 = new Account({
            publicKey: '',
            address: BigInt('0000000000000000001'),
            arp: {
                stakes: [
                    {
                        createdAt: 0,
                        isActive: true,
                        amount: 10 * COIN_MULTIPLIER,
                        voteCount: 0,
                        nextVoteMilestone: 0,
                        airdropReward: null,
                        sourceTransactionId: Buffer.alloc(0)
                    }
                ]
            }
        });

        accountRepository.add(referrerLevel1);

        const sender = new Account({
            publicKey: '',
            address: BigInt('0000000000000000000'),
            arp: {
                stakes: [
                    {
                        createdAt: 0,
                        isActive: true,
                        amount: 300 * COIN_MULTIPLIER,
                        voteCount: 0,
                        nextVoteMilestone: 0,
                        airdropReward: null,
                        sourceTransactionId: Buffer.alloc(0)
                    }
                ],
                referrals: [
                    referrerLevel1.address
                ]
            }
        });

        const createdAt = 0;
        const availableAirdropBalance = 1000 * COIN_MULTIPLIER;

        const airdropReward = DDK.voteARPCalculator.calculate(sender, availableAirdropBalance, createdAt);
        const expectairdropReward = createAirdropReward();

        expect(expectairdropReward).to.deep.equal(airdropReward);
    });

    it('stake.amount > max', () => {
        const referrerLevel1 = new Account({
            publicKey: '',
            address: BigInt('0000000000000000001'),
            arp: {
                stakes: [
                    {
                        createdAt: 0,
                        isActive: true,
                        amount: 300 * COIN_MULTIPLIER,
                        voteCount: 0,
                        nextVoteMilestone: 0,
                        airdropReward: null,
                        sourceTransactionId: Buffer.alloc(0)
                    }
                ]
            }
        });

        accountRepository.add(referrerLevel1);

        const sender = new Account({
            publicKey: '',
            address: BigInt('0000000000000000000'),
            arp: {
                stakes: [
                    {
                        createdAt: 0,
                        isActive: true,
                        amount: 1000 * COIN_MULTIPLIER,
                        voteCount: 0,
                        nextVoteMilestone: 0,
                        airdropReward: null,
                        sourceTransactionId: Buffer.alloc(0)
                    }
                ],
                referrals: [
                    referrerLevel1.address
                ]
            }
        });

        const createdAt = 0;
        const availableAirdropBalance = 1000 * COIN_MULTIPLIER;

        const airdropReward = DDK.voteARPCalculator.calculate(sender, availableAirdropBalance, createdAt);
        const expectairdropReward = createAirdropReward();

        expect(expectairdropReward).to.deep.equal(airdropReward);
    });

    it('Empty referrals', () => {
        const sender = new Account({
            publicKey: '',
            address: BigInt('0000000000000000000'),
            arp: {
                stakes: [
                    {
                        createdAt: 0,
                        isActive: true,
                        amount: 1000 * COIN_MULTIPLIER,
                        voteCount: 0,
                        nextVoteMilestone: 0,
                        airdropReward: null,
                        sourceTransactionId: Buffer.alloc(0)
                    }
                ]
            }
        });

        const createdAt = 0;
        const availableAirdropBalance = 1000 * COIN_MULTIPLIER;

        const airdropReward = DDK.voteARPCalculator.calculate(sender, availableAirdropBalance, createdAt);
        const expectairdropReward = createAirdropReward();

        expect(expectairdropReward).to.deep.equal(airdropReward);
    });

    it('availableAirdropBalance < reward', () => {
        const referrerLevel1 = new Account({
            publicKey: '',
            address: BigInt('0000000000000000001'),
            arp: {
                stakes: [
                    {
                        createdAt: 0,
                        isActive: true,
                        amount: 300 * COIN_MULTIPLIER,
                        voteCount: 0,
                        nextVoteMilestone: 0,
                        airdropReward: null,
                        sourceTransactionId: Buffer.alloc(0)
                    }
                ]
            }
        });

        accountRepository.add(referrerLevel1);

        const sender = new Account({
            publicKey: '',
            address: BigInt('0000000000000000000'),
            arp: {
                stakes: [
                    {
                        createdAt: 0,
                        isActive: true,
                        amount: 300 * COIN_MULTIPLIER,
                        voteCount: 0,
                        nextVoteMilestone: 0,
                        airdropReward: null,
                        sourceTransactionId: Buffer.alloc(0)
                    }
                ],
                referrals: [
                    referrerLevel1.address
                ]
            }
        });

        const createdAt = 0;
        const availableAirdropBalance = 1 * COIN_MULTIPLIER;

        const airdropReward = DDK.voteARPCalculator.calculate(sender, availableAirdropBalance, createdAt);
        const expectairdropReward = createAirdropReward();

        expect(expectairdropReward).to.deep.equal(airdropReward);
    });

    it('Airdrop Reward Level 1', () => {
        const referrerLevel1 = new Account({
            publicKey: '',
            address: BigInt('0000000000000000001'),
            arp: {
                stakes: [
                    {
                        createdAt: 0,
                        isActive: true,
                        amount: 500 * COIN_MULTIPLIER,
                        voteCount: 0,
                        nextVoteMilestone: 0,
                        airdropReward: null,
                        sourceTransactionId: Buffer.alloc(0)
                    }
                ]
            }
        });

        accountRepository.add(referrerLevel1);

        const sender = new Account({
            publicKey: '',
            address: BigInt('0000000000000000000'),
            arp: {
                stakes: [
                    {
                        createdAt: 0,
                        isActive: true,
                        amount: 300 * COIN_MULTIPLIER,
                        voteCount: 0,
                        nextVoteMilestone: 0,
                        airdropReward: null,
                        sourceTransactionId: Buffer.alloc(0)
                    }
                ],
                referrals: [
                    referrerLevel1.address
                ]
            }
        });

        const activeStakeAmount = 300 * COIN_MULTIPLIER;
        const availableAirdropBalance = 1000 * COIN_MULTIPLIER;

        const airdropReward = DDK.voteARPCalculator.calculate(sender, activeStakeAmount, availableAirdropBalance);
        const expectairdropReward = createAirdropReward(new Map([
            [
                referrerLevel1.address,
                Math.ceil(300 * COIN_MULTIPLIER * DDK.config.ARP.CHAIN_REWARD.PERCENT_PER_LEVEL[0])
            ],
        ]));

        expect(expectairdropReward).to.deep.equal(airdropReward);
    });

    it('Airdrop Reward Level 1, 2, 3', () => {
        const referrerLevel1 = new Account({
            publicKey: '',
            address: BigInt('0000000000000000001'),
            arp: {
                stakes: [
                    {
                        createdAt: 0,
                        isActive: true,
                        amount: 300 * COIN_MULTIPLIER,
                        voteCount: 0,
                        nextVoteMilestone: 0,
                        airdropReward: null,
                        sourceTransactionId: Buffer.alloc(0)
                    },
                    {
                        createdAt: 0,
                        isActive: true,
                        amount: 200 * COIN_MULTIPLIER,
                        voteCount: 0,
                        nextVoteMilestone: 0,
                        airdropReward: null,
                        sourceTransactionId: Buffer.alloc(0)
                    }
                ]
            }
        });

        const referrerLevel2 = new Account({
            publicKey: '',
            address: BigInt('0000000000000000002'),
            arp: {
                stakes: [
                    {
                        createdAt: 0,
                        isActive: false,
                        amount: 500 * COIN_MULTIPLIER,
                        voteCount: 0,
                        nextVoteMilestone: 0,
                        airdropReward: null,
                        sourceTransactionId: Buffer.alloc(0)
                    }
                ]
            }
        });

        const referrerLevel3 = new Account({
            publicKey: '',
            address: BigInt('0000000000000000003'),
            arp: {
                stakes: [
                    {
                        createdAt: 0,
                        isActive: true,
                        amount: 500 * COIN_MULTIPLIER,
                        voteCount: 0,
                        nextVoteMilestone: 0,
                        airdropReward: null,
                        sourceTransactionId: Buffer.alloc(0)
                    }
                ]
            }
        });

        accountRepository.add(referrerLevel1);
        accountRepository.add(referrerLevel2);
        accountRepository.add(referrerLevel3);

        const sender = new Account({
            publicKey: '',
            address: BigInt('0000000000000000000'),
            arp: {
                stakes: [
                    {
                        createdAt: 0,
                        isActive: true,
                        amount: 300 * COIN_MULTIPLIER,
                        voteCount: 0,
                        nextVoteMilestone: 0,
                        airdropReward: null,
                        sourceTransactionId: Buffer.alloc(0)
                    }
                ],
                referrals: [
                    referrerLevel1.address,
                    referrerLevel2.address,
                    referrerLevel3.address
                ]
            }
        });

        const availableAirdropBalance = 1000 * COIN_MULTIPLIER;
        const activeStakeAmount = 300 * COIN_MULTIPLIER;
        const airdropReward = DDK.voteARPCalculator.calculate(sender, activeStakeAmount, availableAirdropBalance);
        const expectedAirdropReward = createAirdropReward(new Map([
            [
                referrerLevel1.address,
                Math.ceil(300 * COIN_MULTIPLIER * DDK.config.ARP.CHAIN_REWARD.PERCENT_PER_LEVEL[0]),
            ],
            [
                referrerLevel3.address,
                Math.ceil(300 * COIN_MULTIPLIER * DDK.config.ARP.CHAIN_REWARD.PERCENT_PER_LEVEL[2]),
            ],
        ]));

        expect(expectedAirdropReward).to.deep.equal(airdropReward);
    });
});
