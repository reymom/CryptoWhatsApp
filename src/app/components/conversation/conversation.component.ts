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
    }

    ngOnInit() { }

    async sendMessage($event) {
        console.log($event.message)
        this.messagesService.messages.push({
            text: $event.message,
            user: {
                name: "Reymon"
            },
            reply: true,
            timestamp: Date.now()
        });

        if (!$event.message) return;

        this.messagesService.sendMessageTo(this.messagesService.contact.address, $event.message);
    }
}
