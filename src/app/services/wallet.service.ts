import { Injectable } from "@angular/core";

import * as Mnemonic from "bitcore-mnemonic";
import { hdkey } from "ethereumjs-wallet";
import * as bip39 from "bip39";
import * as util from "ethereumjs-util";
import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: "root"
})
export class WalletService {
    address;

    balance = 0;

    privateKey;

    publicKey;

    mnemonic;

    encrypted;

    wallet;

    chatComponent = true;
    conversationComponent = false;

    walletInfo;

    constructor() {
        this.encrypted = window.localStorage.getItem("seeds");

        if (!this.encrypted) {
            var code = new Mnemonic(Mnemonic.Words.ENGLISH);
            console.log('randomSeed = ', code.toString());
        }
    }

    showChats() {
        this.chatComponent = !this.chatComponent;
        this.conversationComponent = !this.conversationComponent;
    }

    async initWallet(seeds, web3) {
        var mnemonic = new Mnemonic(seeds);

        bip39.mnemonicToSeed(mnemonic.toString()).then(async seed => {
            var path = "m/44'/60'/0'/0/0";
            this.wallet = hdkey.fromMasterSeed(seed).derivePath(path).getWallet();
            this.privateKey = this.wallet.getPrivateKey();
            this.publicKey = util.privateToPublic(this.privateKey);
            this.address = '0x' + util.pubToAddress(this.publicKey).toString('hex');
            this.balance = await this.getBalance(this.address, web3);
        });
    }

    async getBalance(address, web3) {
        console.log('getBalance');
        return web3.eth.getBalance(address).then(web3.utils.fromWei);
    }

    getWallet() {
        return this.wallet;
    }

    getAddress() {
        return this.address;
    }

    decrypt(password) {
        var decrypt = CryptoJS.AES.decrypt(this.encrypted, password);
        return decrypt.toString(CryptoJS.enc.Utf8);
    }

}
