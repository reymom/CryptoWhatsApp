import { Component } from "@angular/core";
import { NodeService } from "./services/node.service";
import { WalletService } from "./services/wallet.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent {
    title = "CryptoWhatsApp";

    constructor(public walletService: WalletService) { }

    logout() {
        this.walletService.address = '';
        this.walletService.wallet = '';
    }
}
