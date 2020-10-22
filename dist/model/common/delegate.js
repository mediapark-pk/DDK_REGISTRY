"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const account_1 = require("./account");
class Delegate {
    constructor(data) {
        this.username = data.username;
        this.missedBlocks = data.missedBlocks;
        this.forgedBlocks = data.forgedBlocks;
        this.account = data.account instanceof account_1.Account
            ? data.account
            : new account_1.Account(data.account);
        this.votes = data.votes;
        this.confirmedVoteCount = data.confirmedVoteCount;
        this.approval = data.approval || 0;
    }
}
exports.Delegate = Delegate;
var ForgeStatus;
(function (ForgeStatus) {
    ForgeStatus["WAITING"] = "WAITING";
    ForgeStatus["FORGING"] = "FORGING";
    ForgeStatus["FORGED"] = "FORGED";
    ForgeStatus["MISSED"] = "MISSED";
})(ForgeStatus = exports.ForgeStatus || (exports.ForgeStatus = {}));
