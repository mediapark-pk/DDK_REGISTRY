"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const delegate_1 = require("./delegate");
const stake_1 = require("./transaction/stake");
const account_1 = require("../../util/account");
const airdrop_1 = require("./airdrop");
class Account {
    constructor(data) {
        this.getAllStakes = () => {
            return [...this.stakes, ...this.arp.stakes];
        };
        this.getActiveStakes = () => {
            return this.getAllStakes().filter(stake => stake.isActive);
        };
        this.getARPActiveStakes = () => {
            return this.arp.stakes.filter(stake => stake.isActive);
        };
        this.getTotalStakeAmount = () => {
            return this.getAllStakes().reduce((acc, stake) => {
                if (stake.isActive) {
                    acc += stake.amount;
                }
                return acc;
            }, 0);
        };
        this.publicKey = data.publicKey;
        this.actualBalance = data.actualBalance || 0;
        this.address = data.address || account_1.getAddressByPublicKey(data.publicKey);
        this.secondPublicKey = data.secondPublicKey;
        if (data.delegate) {
            this.delegate = new delegate_1.Delegate(Object.assign({}, data.delegate, { account: this }));
        }
        this.votes = data.votes || [];
        this.referrals = data.referrals || [];
        this.stakes = (data.stakes || []).map(item => new stake_1.Stake(Object.assign({}, item)));
        this.arp = new airdrop_1.Airdrop(data.arp);
    }
}
exports.Account = Account;
