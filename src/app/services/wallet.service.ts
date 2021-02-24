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

    privateKey;

    publicKey;

    mnemonic;

    encrypted;

    wallet;

    constructor() {
        this.encrypted = window.localStorage.getItem("seeds");

        /* var seeds =
          "frequent antique present skull method memory liberty crouch wrap dice verify joy";

        // 0xe1e63ce0ad1d159c0a9180e2f525d1ed393e1535
        // 0x33f41757609b06b17fe8e886e703a8efeca42658

        // FAKE
        // this.initWallet(seeds); */
    }

    async initWallet(seeds) {
        var mnemonic = new Mnemonic(seeds);

        bip39.mnemonicToSeed(mnemonic.toString()).then(async seed => {
            var path = "m/44'/60'/0'/0/0";
            this.wallet = hdkey.fromMasterSeed(seed).derivePath(path).getWallet();
            this.privateKey = this.wallet.getPrivateKey();
            this.publicKey = util.privateToPublic(this.privateKey);
            this.address = '0x' + util.pubToAddress(this.publicKey).toString('hex');
            console.log('my address = ' + this.address);
        });
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
