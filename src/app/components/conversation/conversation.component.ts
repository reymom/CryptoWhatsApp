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

    initialMessages = [];

    constructor(
        private messagesService: MessagesService, 
        private formBuilder: FormBuilder, 
    ) {
        this.sendForm = this.formBuilder.group({
            message: ""
        });

        var reply = false;
        var sender = 'Demo Boot';
        var date = Date.now();
        var messages = [
            'Hello :)',
            'Introduce a name and an Ethereum contact address in the sidebar to start talking with somebody through messages in the blockchain',
            'This runs in the testnet Ropsten',
            'You can use this address if you want: 0x083d6c8Fd582C8dA8307FE421409EEc82D4b4304',
            'It has no ether in Mainnet nor in Ropsten so I cannot reply, so you can send it some, but do it in the mainnet xD',
        ]
        messages.forEach( msg => 
            this.initialMessages.push({
                message: msg,
                reply: reply,
                sender: sender,
                date: date
            })
        )
    }

    ngOnInit() { }

    async sendMessage($event) {
        console.log($event.message)
        this.messagesService.messages.push({
            text: $event.message,
            user: {
                name: 'You'
            },
            reply: true,
            timestamp: Date.now()
        });

        if (!$event.message) return;

        this.messagesService.sendMessageTo(this.messagesService.contact.address, $event.message);
    }
}
