export interface IFeatureController {
    isEnabled(blockHeight: number): boolean;
}
export declare class FeatureController implements IFeatureController {
    private readonly enableBlockHeight;
    constructor(enableBlockHeight: number);
    isEnabled(blockHeight: number): boolean;
}
