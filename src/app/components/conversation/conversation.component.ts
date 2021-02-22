import { Component, OnInit } from "@angular/core";

import { WalletService } from "src/app/services/wallet.service";
import { NodeService } from "src/app/services/node.service";
import { MessagesService } from "src/app/services/messages.service";
import { FormBuilder } from "@angular/forms";

@Component({
    selector: "app-conversation",
    templateUrl: "./conversation.component.html",
    styleUrls: ["./conversation.component.css"]
})
export class ConversationComponent implements OnInit {
    sendForm;

    constructor(
        private messagesService: MessagesService, 
        private formBuilder: FormBuilder, 
        private walletService: WalletService
    ) {
        this.sendForm = this.formBuilder.group({
            message: ""
        });

        console.log(this.messagesService.messages);
    }

    ngOnInit() { }

    async sendMessage($event) {
        /* this.messages.push({
          text: $event.message,
          user: {
            name: "Reymon"
          },
          reply: true
        }); */

        if (!$event.message) return;

        /*TO-DO realizar envio a blockchain del mensaje*/
    }
}
