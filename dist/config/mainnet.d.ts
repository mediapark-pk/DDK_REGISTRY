export declare const CONFIG_MAINNET: {
    AIRDROP: {
        ADDRESS: string;
        TOTAL_AMOUNT: number;
        STAKE_REWARD_PERCENT: number;
        REFERRAL_PERCENT_PER_LEVEL: number[];
    };
    ARP: {
        ADDRESS: string;
        TOTAL_AMOUNT: number;
        ENABLED_BLOCK_HEIGHT: number;
        DIRECT_REWARD: {
            PERCENT_PER_LEVEL: number[];
            MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE: number;
        };
        CHAIN_REWARD: {
            PERCENT_PER_LEVEL: number[];
            MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE: number;
        };
    };
    STAKE: {
        VOTE_MILESTONE: number;
        REWARDS: {
            MILESTONES: number[];
            DISTANCE: number;
        };
        REWARD_VOTE_COUNT: number;
        UNSTAKE_VOTE_COUNT: number;
    };
};
