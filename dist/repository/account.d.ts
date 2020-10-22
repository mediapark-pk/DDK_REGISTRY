import { Address, PublicKey } from '../model/common/type';
import { Account } from '../model/common/account';
export interface IAccountRepository {
    add(accountData: {
        address: Address;
        publicKey?: PublicKey;
    }): Account;
    getByAddress(accountAddress: Address): Account;
    getByPublicKey(accountPublicKey: PublicKey): Account;
}
export declare class AccountRepository {
    private memoryAccountsByAddress;
    add(accountData: {
        address: Address;
        publicKey?: PublicKey;
    }): Account;
    getByAddress(accountAddress: Address): Account;
    getByPublicKey(accountPublicKey: PublicKey): Account;
}
