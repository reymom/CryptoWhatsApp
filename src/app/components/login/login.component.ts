import { Component, OnInit } from "@angular/core";
import { NodeService } from "src/app/services/node.service";
import { WalletService } from "src/app/services/wallet.service";
import { FormBuilder } from "@angular/forms";

import * as Mnemonic from "bitcore-mnemonic";
import * as CryptoJS from "crypto-js";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
    loginForm;

    constructor(
        private formBuilder: FormBuilder,
        private nodeService: NodeService,
        public walletService: WalletService
    ) {
        this.loginForm = this.formBuilder.group({
            seeds: "",
            password: ""
        });
    }

    ngOnInit() { }

    sendLogin(loginData) {
        if (!loginData.password) return alert("Introduce your password");

        if (this.walletService.encrypted) {
            loginData.seeds = this.walletService.decrypt(loginData.password);
        }

        if (!Mnemonic.isValid(loginData.seeds)) {
            return alert("Seeds aren't valid");
        }

        this.walletService.encrypted = CryptoJS.AES.encrypt(
            loginData.seeds,
            loginData.password
        ).toString();

        window.localStorage.setItem("seeds", this.walletService.encrypted);

        this.loginForm.reset();

        this.walletService.initWallet(loginData.seeds, this.nodeService.web3);
    }
}
