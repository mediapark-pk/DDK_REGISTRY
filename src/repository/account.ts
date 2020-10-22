import { Address, PublicKey } from '../model/common/type';
import { Account } from '../model/common/account';
import { getAddressByPublicKey } from '../util/account';

export interface IAccountRepository {
    add(accountData: { address: Address, publicKey?: PublicKey; }): Account;

    getByAddress(accountAddress: Address): Account;

    getByPublicKey(accountPublicKey: PublicKey): Account;
}

export class AccountRepository {
    private memoryAccountsByAddress: Map<Address, Account> = new Map<Address, Account>();

    public add(accountData: { address: Address, publicKey?: PublicKey; }): Account {
        const accountModel = new Account(accountData);
        this.memoryAccountsByAddress.set(accountData.address, accountModel);
        return accountModel;
    }

    getByAddress(accountAddress: Address): Account {
        return this.memoryAccountsByAddress.get(accountAddress) || null;
    }

    getByPublicKey(accountPublicKey: PublicKey): Account {
        const address = getAddressByPublicKey(accountPublicKey);
        return this.memoryAccountsByAddress.get(address) || null;
    }
}
