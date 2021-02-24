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
    contacts: { name: string; address: string }[];

    addForm;

    constructor(private formBuilder: FormBuilder, private messagesService: MessagesService) {
        this.addForm = this.formBuilder.group({
            name: "",
            address: ""
        });

        this.contacts = JSON.parse(window.localStorage.getItem("contacts")) || [];
    }

    ngOnInit() { }

    addContact(contactData) {
        if (!contactData.name || !contactData.address) {
            return alert("Please, fill in all the data");
        }

        if (!util.isValidAddress(contactData.address)) {
            return alert("Please, introduce a valid address");
        }

        this.contacts.push(contactData);

        window.localStorage.setItem("contacts", JSON.stringify(this.contacts));

        this.addForm.reset();
    }

    selectContact(contactData) {
        this.messagesService.selectContact(contactData);
    }
}
