export declare enum WORKSPACE {
    DEVELOPMENT = 0,
    TESTNET = 1,
    MAINNET = 2
}
export declare type ConfigSchema = {
    MAX_REFERRAL_COUNT: number;
    SALT_LENGTH: number;
    EPOCH_TIME: number;
    SLOT_INTERVAL: number;
    MAX_VOTES_PER_TRANSACTION: number;
    FEES: {
        SEND: number;
        VOTE: number;
        SIGNATURE: number;
        DELEGATE: number;
        STAKE: number;
        SEND_STAKE: number;
    };
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
            PERCENT_PER_LEVEL: Array<number>;
            MIN_ACTIVE_STAKE_AMOUNT_FOR_RECEIVE: number;
        };
        CHAIN_REWARD: {
            PERCENT_PER_LEVEL: Array<number>;
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
export declare const CONFIG_DEFAULT: {
    MAX_REFERRAL_COUNT: number;
    SALT_LENGTH: number;
    EPOCH_TIME: number;
    SLOT_INTERVAL: number;
    MAX_VOTES_PER_TRANSACTION: number;
    FEES: {
        SEND: number;
        VOTE: number;
        SIGNATURE: number;
        DELEGATE: number;
        STAKE: number;
        SEND_STAKE: number;
    };
};
export declare const getConfig: (workspace: WORKSPACE) => ConfigSchema;
