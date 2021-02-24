import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";

import * as util from "ethereumjs-util";
import { MessagesService } from "src/app/services/messages.service";

@Component({
    selector: "app-chats",
    templateUrl: "./chats.component.html",
    styleUrls: ["./chats.component.css"]
})
export class ChatsComponent implements OnInit {
    addForm;

    constructor(
        private formBuilder: FormBuilder, 
        private messagesService: MessagesService
    ) {
        this.addForm = this.formBuilder.group({
            name: "",
            address: ""
        });

    }

    ngOnInit() { }

    addContact(contactData) {
        if (!contactData.name || !contactData.address) {
            return alert("Please, fill in all the data");
        }

        if (contactData.address == this.messagesService.address) {
            return alert("You cannot introduce your own address");
        }

        if (!util.isValidAddress(contactData.address)) {
            return alert("Please, introduce a valid address");
        }

        this.messagesService.contacts.forEach( contact => {
            if (contact.address == contactData.address) {
                return alert("Contact already registered!");
            }
        });

        var length = 0;
        var index = this.messagesService.addresses.indexOf(contactData.address);
        if (index != -1) {
            length = this.messagesService.lengths[index];
        }
        var contact = {
            name: contactData.name,
            address: contactData.address,
            length: length
        };
        this.messagesService.contacts.push(contact);

        window.localStorage.setItem("contacts", JSON.stringify(this.messagesService.contacts));

        var i = this.messagesService.addresses.indexOf(contactData.address);
        if (i != -1) {
            this.messagesService.addresses.splice(i, 1);
            this.messagesService.lengths.splice(i, 1);
        }

        this.addForm.reset();
    }

    selectContact(contactData) {
        this.messagesService.selectContact(contactData);
    }
}
