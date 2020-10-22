export interface IFeatureController {
    isEnabled(blockHeight: number): boolean;
}

export class FeatureController implements IFeatureController {
    constructor(private readonly enableBlockHeight: number) { }

    isEnabled(blockHeight: number): boolean {
        return blockHeight >= this.enableBlockHeight;
    }
}
