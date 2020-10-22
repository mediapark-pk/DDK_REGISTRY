import { WORKSPACE, getConfig, ConfigSchema } from './config';
import { IRewardCalculator, initRewardCalculator } from './util/reward';
import { initStakeARPCalculator } from './util/arp/stake';
import { initVoteARPCalculator } from './util/arp/vote';
import { Feature } from './model/common/feature';
import { IARPCalculator } from './util/arp/calculator';
import { IAccountRepository } from './repository/account';

export * from './config';

export class DDKRegistry {
    private _config: ConfigSchema;
    private _rewardCalculator: IRewardCalculator;
    private _stakeARPCalculator: IARPCalculator;
    private _voteARPCalculator: IARPCalculator;
    private _accountRepo: IAccountRepository;

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

    isFeatureEnabled(feature: Feature, lastBlockHeight: number): boolean {
        switch (feature) {
            case Feature.ARP:
                return lastBlockHeight >= this.config.ARP.ENABLED_BLOCK_HEIGHT;
            default:
                return false;
        }
    }

    initialize(workspace: WORKSPACE = WORKSPACE.MAINNET, accountRepo: IAccountRepository) {
        this._config = getConfig(workspace);
        this._accountRepo = accountRepo;
        this._rewardCalculator = initRewardCalculator(this._config);
        this._stakeARPCalculator = initStakeARPCalculator(this.config);
        this._voteARPCalculator = initVoteARPCalculator(this.config);
    }
}

const DDK = new DDKRegistry();

export default DDK;
