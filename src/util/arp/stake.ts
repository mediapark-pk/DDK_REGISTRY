import { ARPCalculator } from './calculator';
import { ConfigSchema } from '../../config';

export const initStakeARPCalculator = (config: ConfigSchema) => new ARPCalculator(
    config.ARP.DIRECT_REWARD.PERCENT_PER_LEVEL,
    config.ARP.DIRECT_REWARD.MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE,
);
