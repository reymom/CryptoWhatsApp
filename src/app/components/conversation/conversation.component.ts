import { Component, OnInit } from "@angular/core";
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
        public messagesService: MessagesService, 
        private formBuilder: FormBuilder, 
    ) {
        this.sendForm = this.formBuilder.group({
            message: ""
        });

        var reply = false;
        var sender = 'Demo Boot';
        var date = Date.now();
        var messages = [
            'Hello :) \nThis runs in the testnet Ropsten',
            'You see the addresses with whom you have a conversation initiated in the blockchain above the logout button',
            'To import them and load the messages just copy the address and introduce a name for it! :D',
            'Or you can simply initiate a new conversation, for example, with: 0x083d6c8Fd582C8dA8307FE421409EEc82D4b4304',
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
        if (!$event.message) return;
        this.messagesService.sendMessageTo(this.messagesService.contact.address, $event.message);
        this.messagesService.messages.push({
            text: $event.message,
            user: {
                name: 'You'
            },
            reply: true,
            timestamp: Date.now()
        });
        this.messagesService.contacts.forEach(contact => {
            if (contact.address == this.messagesService.contact.address) {
                var length = Number(contact.length) + 1;
                contact.length = length;
            }
        });
        window.localStorage.setItem("contacts", JSON.stringify(this.messagesService.contacts));
    }
}
