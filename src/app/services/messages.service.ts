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

  constructor(private nodeService: NodeService, public walletService: WalletService) {
    this.address = this.walletService.getAddress();
  }

  selectContact(contact) {
    this.contact = contact;
    console.log("me:"+this.address );
    console.log("contact"+this.contact.address);
    this.messages = [];

      /*TO-DO cargar conversación con contacto*/
  }

  getContact() {
    return this.contact;
  }

  async lastIdMessageFromTo(address) {
    /*TO-DO recuperar cantidad de mensajes de la conversación*/
  }



  async readMessage(address,count) {
    /*TO-DO leer un mensje individual*/
  }

  async readAllMessages(address,count){
  /*TO-DO recuperar y cargar en pantalla conversación*/
  }




  sendMessageTo(address, message) {
    /*TO-DO  enviar mensaje*/
  }
}
