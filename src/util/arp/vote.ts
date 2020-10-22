import { ARPCalculator } from './calculator';
import { ConfigSchema } from '../..';

export const initVoteARPCalculator = (config: ConfigSchema) => new ARPCalculator(
    config.ARP.CHAIN_REWARD.PERCENT_PER_LEVEL,
    config.ARP.CHAIN_REWARD.MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE,
);
