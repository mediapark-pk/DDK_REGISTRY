"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const account_1 = require("../model/common/account");
const account_2 = require("../util/account");
class AccountRepository {
    constructor() {
        this.memoryAccountsByAddress = new Map();
    }
    add(accountData) {
        const accountModel = new account_1.Account(accountData);
        this.memoryAccountsByAddress.set(accountData.address, accountModel);
        return accountModel;
    }
    getByAddress(accountAddress) {
        return this.memoryAccountsByAddress.get(accountAddress) || null;
    }
    getByPublicKey(accountPublicKey) {
        const address = account_2.getAddressByPublicKey(accountPublicKey);
        return this.memoryAccountsByAddress.get(address) || null;
    }
}
exports.AccountRepository = AccountRepository;
