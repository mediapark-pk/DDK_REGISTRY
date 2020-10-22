import { AirdropReward, Address } from '../../model/common/type';

export const createAirdropReward = (sponsors = new Map<Address, number>()): AirdropReward => {
    return {
        sponsors,
    };
};

export const calculateTotalAirdropReward = (airdrop: AirdropReward): number => {
    let totalAirdropReward = 0;
    airdrop.sponsors.forEach((reward: number) => {
        totalAirdropReward += reward;
    });
    return totalAirdropReward;
};
