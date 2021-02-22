import { Component } from "@angular/core";
import { WalletService } from "./services/wallet.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent {
    title = "example05";

    constructor(public walletService: WalletService) { }

    logout() {
        alert("Are you sure?");
    }
}
