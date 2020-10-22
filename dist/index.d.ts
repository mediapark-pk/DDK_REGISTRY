import { WORKSPACE, ConfigSchema } from './config';
import { IRewardCalculator } from './util/reward';
import { Feature } from './model/common/feature';
import { IARPCalculator } from './util/arp/calculator';
import { IAccountRepository } from './repository/account';
export * from './config';
export declare class DDKRegistry {
    private _config;
    private _rewardCalculator;
    private _stakeARPCalculator;
    private _voteARPCalculator;
    private _accountRepo;
    readonly config: ConfigSchema;
    readonly rewardCalculator: IRewardCalculator;
    readonly stakeARPCalculator: IARPCalculator;
    readonly voteARPCalculator: IARPCalculator;
    readonly accountRepository: IAccountRepository;
    isFeatureEnabled(feature: Feature, lastBlockHeight: number): boolean;
    initialize(workspace: WORKSPACE, accountRepo: IAccountRepository): void;
}
declare const DDK: DDKRegistry;
export default DDK;
