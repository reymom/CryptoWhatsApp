import { Injectable } from "@angular/core";
import { WalletService } from "./wallet.service";

import Web3 from "web3";
import { Transaction } from "ethereumjs-tx";
import { ChatContractABI } from "./contract";
require("regenerator-runtime/runtime");

@Injectable({
    providedIn: "root"
})
export class NodeService {
    web3;

    ChatContract;

    ChatContractAddress;

    transactionOnCourse = false;

    constructor(private walletService: WalletService) {
        this.web3 = new Web3(
            new Web3.providers.HttpProvider(
                "https://ropsten.infura.io/v3/d09825f256ae4705a74fdee006040903"
            )
        );

        this.ChatContractAddress = "0x90eCb418AAFd4a21010EA0f0d6b2fdf36792050f";

        this.ChatContract = new this.web3.eth.Contract(
            ChatContractABI,
            this.ChatContractAddress
        );
    }

    async sendTransaction(from, to, data, privateKey) {
        if (this.transactionOnCourse) {
            alert("Please wait for current transaction to be integrated to the blockchain");
            return "";
        }
        else {
            var rawData = {
                from: from,
                to: to,
                value: 0,
                gasPrice: this.web3.utils.toHex(10000000000),
                gasLimit: this.web3.utils.toHex(1000000),
                nonce: await this.web3.eth.getTransactionCount(from),
                data: data
            };

            var transaction = new Transaction(rawData, { chain: "ropsten" });

            this.transactionOnCourse = true;
            transaction.sign(privateKey);

            var serialized = "0x" + transaction.serialize().toString("hex");
            await this.web3.eth.sendSignedTransaction(serialized)
                .on('transactionHash', function (hash) {
                    console.log("hash = " + hash);
                })
                .then(receipt => {
                    console.log('receipt = ', receipt);
                    this.transactionOnCourse = false;
                }, error => {
                    console.log("error = " + error);
                })
        }
    }
}
