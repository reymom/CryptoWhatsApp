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
        if (this.address) {
            this.getConversationsWith(this.address);
        }
    }

    async getConversationsWith(address) {
        var getConversationIds = this.nodeService.ChatContract.methods.getUserConvIds(address);
        var conversationIds = await getConversationIds.call();

        conversationIds.forEach( async id => {
            if (id != '0') {
                var getAddressesConversation = this.nodeService.ChatContract.methods.getAddressesConv(id);
                var addressesConversation = await getAddressesConversation.call();    
                if (addressesConversation[0].toUpperCase() == this.address.toUpperCase()) {
                    var userAddress = addressesConversation[1];
                } else {
                    var userAddress = addressesConversation[0];
                }
                var existent = false;
                this.contacts.forEach( contact => {
                    if (contact.address.toUpperCase() == userAddress.toUpperCase()) {
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
        } )
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
                messageIds.forEach( async messageId => {
                    var messageInfo = await this.readMessage(messageId);
                    if (messageInfo[0].toUpperCase() == this.address.toUpperCase()) {
                        var userName = 'You';
                        var reply = true;
                    } else {
                        var userName = this.contact.name;
                        var reply = false;
                    }
                    var message = {
                        text: messageInfo[2],
                        user: {
                            name: userName
                        },
                        reply: reply,
                        unixTime: parseInt(messageInfo[3]),
                        timestamp: new Date(parseInt(messageInfo[3]) * 1000)
                    }
                    this.messages.push(message);
                });
            } catch(error) {
                console.log('error', error);
            }
        }
    }

    sortMessages(messages) {
        return messages.sort((a, b) => a.unixTime - b.unixTime);
    }

    async getNumMessagesConversation(userAddress) {
        var getConversationId = this.nodeService.ChatContract.methods.getConvId(this.address, userAddress);
        var conversationID = await getConversationId.call();
        var getConversationLength = this.nodeService.ChatContract.methods.getConvLength(conversationID);
        var conversationLength = await getConversationLength.call();
        return conversationLength;
    }

    async readMessage(messageId) {
        var getMessageInfo = this.nodeService.ChatContract.methods.getMessageInfo(messageId);
        var messageInfo = await getMessageInfo.call();
        return messageInfo;
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
