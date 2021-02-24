import { Injectable } from "@angular/core";
import { Transaction } from "ethereumjs-tx";
import { NodeService } from "./node.service";
import { WalletService } from "./wallet.service";

@Injectable({
    providedIn: "root"
})
export class MessagesService {
    contact = {
        name: "...",
        address: ""
    };

    conversations;

    messages;

    address;

    constructor(
        private nodeService: NodeService,
        public walletService: WalletService
    ) {
        this.address = this.walletService.getAddress();
    }

    async getConversations() {
        var getConversationIds = this.nodeService.ChatContract.methods.getUserConvIds(this.address);
        var conversationIds = await getConversationIds.call();
        console.log('conversation ids = ', conversationIds);

        var contacts = []
        for (let id in conversationIds) {

            contacts.push({ address: 'string' })
        }
        window.localStorage.setItem("contacts", JSON.stringify(contacts));
    }

    async selectContact(contact) {
        this.contact = contact;
        console.log("my address = " + this.address);
        console.log("contact address = " + this.contact.address);
        this.messages = [];

        var getConversationId = this.nodeService.ChatContract.methods.getConvId(this.address, this.contact.address);
        var conversationId = await getConversationId.call();
        console.log('conversationID = ', conversationId);
        if (conversationId) {
            try {
                var getMessageIds = this.nodeService.ChatContract.methods.getConvMessageIds(conversationId);
                var messageIds = await getMessageIds.call();
                for (let messageId in messageIds) {
                    var getMessageInfo = this.nodeService.ChatContract.methods.getMessageInfo(messageId);
                    var messageInfo = await getMessageInfo.call();
                    console.log('messageInfo = ', messageInfo);
                    var message = {
                        text: messageInfo[2],
                        user: {
                            name: this.contact.name
                        },
                        reply: true,
                        timestamp: new Date(parseInt(messageInfo[3]) * 1000)
                    }
                    this.messages.push(message);
                }
            } catch(error) {
                console.log('error');
            }
        }
        console.log('messages = ', this.messages);

    }

    getContact() {
        return this.contact;
    }

    async lastIdMessageFromTo(address) {
        /*TO-DO recuperar cantidad de mensajes de la conversación*/
    }

    async readMessage(address, count) {
        /*TO-DO leer un mensje individual*/
    }

    async readAllMessages(address, count) {
        /*TO-DO recuperar y cargar en pantalla conversación*/
    }

    sendMessageTo(address, message) {
        var sendMessage = this.nodeService.ChatContract.methods.sendNewMessage(message, address);
        this.nodeService.sendTransaction(
            this.address, 
            this.nodeService.ChatContractAddress,
            sendMessage.encodeABI(),
            this.walletService.privateKey
        )
    }
}
