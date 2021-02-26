import { Component } from "@angular/core";
import { WalletService } from "./services/wallet.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent {
    title = "CryptoWhatsApp";

    dropDown = false;

    constructor (
        public walletService: WalletService, 
    ) { }

    showWalletInfo() {
        this.dropDown = !this.dropDown;
    }

    logout() {
        this.walletService.address = '';
        this.walletService.wallet = '';
    }
}
