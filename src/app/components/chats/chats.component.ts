import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";

import * as util from "ethereumjs-util";
import { MessagesService } from "src/app/services/messages.service";
import { WalletService } from "src/app/services/wallet.service";


@Component({
    selector: "app-chats",
    templateUrl: "./chats.component.html",
    styleUrls: ["./chats.component.css"]
})
export class ChatsComponent implements OnInit {
    addForm;

    constructor(
        private formBuilder: FormBuilder, 
        public messagesService: MessagesService,
        public walletService: WalletService
    ) {
        this.addForm = this.formBuilder.group({
            name: "",
            address: ""
        });

        this.walletService.walletInfo = [
            {'title': this.walletService.address},
            {'title': this.walletService.balance + ' ETH'}
        ]

    }

    ngOnInit() { }

    addContact(contactData) {
        if (!contactData.name || !contactData.address) {
            return alert("Please, fill in all the data");
        }

        if (contactData.address.toUpperCase() == this.messagesService.address.toUpperCase()) {
            alert("You cannot introduce your own address");
            return false;
        }

        if (!util.isValidAddress(contactData.address)) {
            return alert("Please, introduce a valid address");
        }

        // check if contact already added
        var repeated = false;
        this.messagesService.contacts.forEach( contact => {
            if (contact.address.toUpperCase() == contactData.address.toUpperCase()) {
                repeated = true;
            }
        });
        if (repeated) {
            return alert("Contact already registered!");
        }

        // check if contact had already a conversation
        var i = -1;
        for (let [index, address] of this.messagesService.addresses.entries()) {
            if (address.toUpperCase() == contactData.address.toUpperCase()) {
                i = index;
            } 
        }
        var length = 0;
        if (i != -1) {
            length = this.messagesService.lengths[i];
            this.messagesService.addresses.splice(i, 1);
            this.messagesService.lengths.splice(i, 1);
        }

        // add the contact in the contacts list and select it
        var contact = {
            name: contactData.name,
            address: contactData.address,
            length: length
        };
        this.messagesService.contacts.push(contact);
        window.localStorage.setItem("contacts", JSON.stringify(this.messagesService.contacts));

        this.selectContact({'name': contact.name, 'address': contact.address});
        this.addForm.reset();
    }

    selectContact(contactData) {
        this.messagesService.selectContact(contactData);
        this.walletService.chatComponent = false;
        this.walletService.conversationComponent = true;
    }
}
