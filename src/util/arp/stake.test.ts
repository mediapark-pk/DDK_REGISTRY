
import { expect } from 'chai';
import DDK, { WORKSPACE } from '../..';
import { createAirdropReward } from './util';
import { Account } from '../../model/common/account';
import { COIN_MULTIPLIER } from '../../config/const';
import { AccountRepository, IAccountRepository } from '../../repository/account';

describe('ARP Stack', () => {
    let accountRepository: IAccountRepository;

    beforeEach(() => {
        accountRepository = new AccountRepository();

        DDK.initialize(WORKSPACE.MAINNET, accountRepository);
    });

    it('Empty sender', () => {
        const sender: Account = null;
        const stakeAmount: number = 0;
        const availableAirdropBalance = 1000;

        const airdropReward = DDK.stakeARPCalculator.calculate(sender, stakeAmount, availableAirdropBalance);
        const expectairdropReward = createAirdropReward();

        expect(expectairdropReward).to.deep.equal(airdropReward);
    });

    it('Airdrop Reward Level 1, referrer stack amount < min', () => {
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

        const sender: Account = new Account({ publicKey: '', arp: { referrals: [referrerLevel1.address] } });
        const stakeAmount: number = 200 * COIN_MULTIPLIER;
        const availableAirdropBalance = 1000 * COIN_MULTIPLIER;

        const airdropReward = DDK.stakeARPCalculator.calculate(sender, stakeAmount, availableAirdropBalance);
        const expectairdropReward = createAirdropReward();

        expect(expectairdropReward).to.deep.equal(airdropReward);
    });

    it('Airdrop Reward Level 1, availableAirdropBalance < reward', () => {
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
        const sender: Account = new Account({ publicKey: '', arp: { referrals: [referrerLevel1.address] } });
        const stakeAmount: number = 200 * COIN_MULTIPLIER;
        const availableAirdropBalance = 1 * COIN_MULTIPLIER;

        const airdropReward = DDK.stakeARPCalculator.calculate(sender, stakeAmount, availableAirdropBalance);
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
                        amount: 200 * COIN_MULTIPLIER,
                        voteCount: 0,
                        nextVoteMilestone: 0,
                        airdropReward: null,
                        sourceTransactionId: Buffer.alloc(0)
                    }
                ]
            }
        });

        accountRepository.add(referrerLevel1);
        const sender: Account = new Account({ publicKey: '', arp: { referrals: [referrerLevel1.address] } });
        const stakeAmount: number = 200 * COIN_MULTIPLIER;
        const availableAirdropBalance = 1000 * COIN_MULTIPLIER;

        const airdropReward = DDK.stakeARPCalculator.calculate(sender, stakeAmount, availableAirdropBalance);
        const expectairdropReward = createAirdropReward(new Map([
            [referrerLevel1.address, Math.ceil(stakeAmount * DDK.config.ARP.DIRECT_REWARD.PERCENT_PER_LEVEL[0])]
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
                        amount: 200 * COIN_MULTIPLIER,
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
                        amount: 50 * COIN_MULTIPLIER,
                        voteCount: 0,
                        nextVoteMilestone: 0,
                        airdropReward: null,
                        sourceTransactionId: Buffer.alloc(0)
                    },
                    {
                        createdAt: 0,
                        isActive: true,
                        amount: 50 * COIN_MULTIPLIER,
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

        const sender: Account = new Account({
            publicKey: '',
            arp: {
                referrals: [
                    referrerLevel1.address,
                    referrerLevel2.address,
                    referrerLevel3.address,
                ]
            }
        });
        const stakeAmount: number = 200 * COIN_MULTIPLIER;
        const availableAirdropBalance = 1000 * COIN_MULTIPLIER;

        const airdropReward = DDK.stakeARPCalculator.calculate(sender, stakeAmount, availableAirdropBalance);
        const expectairdropReward = createAirdropReward(new Map([
            [referrerLevel1.address, Math.ceil(stakeAmount * DDK.config.ARP.DIRECT_REWARD.PERCENT_PER_LEVEL[0])],
            [referrerLevel3.address, Math.ceil(stakeAmount * DDK.config.ARP.DIRECT_REWARD.PERCENT_PER_LEVEL[2])]
        ]));

        expect(expectairdropReward).to.deep.equal(airdropReward);
    });

});
