"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const const_1 = require("./const");
exports.CONFIG_DEVELOPMENT = {
    AIRDROP: {
        ADDRESS: '7897332094363171058',
        TOTAL_AMOUNT: 900000 * const_1.COIN_MULTIPLIER,
        STAKE_REWARD_PERCENT: 0.1,
        REFERRAL_PERCENT_PER_LEVEL: [
            0.05, 0.03, 0.02, 0.02, 0.01, 0.01, 0.01, 0.009, 0.008, 0.007, 0.006, 0.005, 0.005, 0.005, 0.005,
        ],
    },
    ARP: {
        ADDRESS: '17273227771820562781',
        TOTAL_AMOUNT: 900000 * const_1.COIN_MULTIPLIER,
        ENABLED_BLOCK_HEIGHT: 0,
        DIRECT_REWARD: {
            PERCENT_PER_LEVEL: [
                0.05, 0.03, 0.02,
            ],
            MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE: 100 * const_1.COIN_MULTIPLIER,
        },
        CHAIN_REWARD: {
            PERCENT_PER_LEVEL: [
                0.05, 0.03, 0.02, 0.02, 0.01, 0.01, 0.01, 0.009, 0.008, 0.007, 0.006, 0.005, 0.005, 0.005, 0.005,
            ],
            MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE: 500 * const_1.COIN_MULTIPLIER,
        },
    },
    STAKE: {
        VOTE_MILESTONE: 10,
        REWARDS: {
            MILESTONES: [
                0.1,
                0.1,
                0.1,
                0.1,
                0.1,
                0.1 // 2% For 31 months and above
            ],
            DISTANCE: 30,
        },
        REWARD_VOTE_COUNT: 2,
        UNSTAKE_VOTE_COUNT: 4,
    },
};
