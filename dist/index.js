"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const reward_1 = require("./util/reward");
const stake_1 = require("./util/arp/stake");
const vote_1 = require("./util/arp/vote");
const feature_1 = require("./model/common/feature");
__export(require("./config"));
class DDKRegistry {
    get config() {
        return this._config;
    }
    get rewardCalculator() {
        return this._rewardCalculator;
    }
    get stakeARPCalculator() {
        return this._stakeARPCalculator;
    }
    get voteARPCalculator() {
        return this._voteARPCalculator;
    }
    get accountRepository() {
        return this._accountRepo;
    }
    isFeatureEnabled(feature, lastBlockHeight) {
        switch (feature) {
            case feature_1.Feature.ARP:
                return lastBlockHeight >= this.config.ARP.ENABLED_BLOCK_HEIGHT;
            default:
                return false;
        }
    }
    initialize(workspace = config_1.WORKSPACE.MAINNET, accountRepo) {
        this._config = config_1.getConfig(workspace);
        this._accountRepo = accountRepo;
        this._rewardCalculator = reward_1.initRewardCalculator(this._config);
        this._stakeARPCalculator = stake_1.initStakeARPCalculator(this.config);
        this._voteARPCalculator = vote_1.initVoteARPCalculator(this.config);
    }
}
exports.DDKRegistry = DDKRegistry;
const DDK = new DDKRegistry();
exports.default = DDK;
