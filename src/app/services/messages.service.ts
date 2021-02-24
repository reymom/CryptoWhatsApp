import { Injectable } from "@angular/core";
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
    messages;
    address;

    contacts: { name: string; address: string; length: number }[];
    addresses = [];
    lengths = [];

    constructor(
        private nodeService: NodeService,
        public walletService: WalletService
    ) {
        this.address = this.walletService.getAddress();
        this.contacts = JSON.parse(window.localStorage.getItem("contacts")) || [];
        this.getConversationsWith(this.address);

        console.log('addresses = ', this.addresses);
        console.log('numMessages = ', this.lengths);
    }

    async getConversationsWith(address) {
        console.log('getConversationsWith(address)');
        var getConversationIds = this.nodeService.ChatContract.methods.getUserConvIds(address);
        var conversationIds = await getConversationIds.call();
        console.log('conversationIds = ', conversationIds);

        conversationIds.forEach( async id => {
            if (id != '0') {
                var getAddressConversation = this.nodeService.ChatContract.methods.getAddressesConv(id);
                var addressConversation = await getAddressConversation.call();                
                var userAddress;
                if (addressConversation[0] == this.address) {
                    userAddress = addressConversation[0];
                } else {
                    userAddress = addressConversation[1];
                }
                var existent = false;
                this.contacts.forEach( contact => {
                    if (contact.address == userAddress) {
                        existent = true;
                    }
                });
                if (!existent) {
                    this.addresses.push(userAddress);
                    this.getNumMessagesConversation(userAddress).then(res => {
                        this.lengths.push(res);
                    });
                }
            }
        })
    }

    async selectContact(contact) {
        this.contact = contact;
        this.messages = [];

        var getConversationId = this.nodeService.ChatContract.methods.getConvId(this.address, this.contact.address);
        var conversationId = await getConversationId.call();
        if (conversationId != 0) {
            try {
                var getMessageIds = this.nodeService.ChatContract.methods.getConvMessageIds(conversationId);
                var messageIds = await getMessageIds.call();
                for (let messageId in messageIds) {
                    var getMessageInfo = this.nodeService.ChatContract.methods.getMessageInfo(messageId);
                    var messageInfo = await getMessageInfo.call();

                    console.log('messageInfo[0] = ', messageInfo[0]);
                    console.log('this.address = ', this.address);
                    if (messageInfo[0].toUpperCase() == this.address.toUpperCase()) {
                        var userName = 'You';
                        var reply = true;
                    } else {
                        var userName = this.contact.name;
                        var reply = false;
                    }
                    console.log('userName = ', userName, 'reply = ', reply)
                    var message = {
                        text: messageInfo[2],
                        user: {
                            name: userName
                        },
                        reply: reply,
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

    async getNumMessagesConversation(userAddress) {
        var getConversationId = this.nodeService.ChatContract.methods.getConvId(this.address, userAddress);
        var conversationID = await getConversationId.call();
        var getConversationLength = this.nodeService.ChatContract.methods.getConvLength(conversationID);
        var conversationLength = await getConversationLength.call();
        console.log('conversationLength = ', conversationLength);
        return conversationLength;
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
