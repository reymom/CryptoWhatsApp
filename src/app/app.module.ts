import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  NbThemeModule,
  NbLayoutModule,
  NbSidebarModule,
  NbButtonModule,
  NbChatModule,
  NbInputModule,
  NbCardModule,
  NbListModule,
  NbUserModule,
  NbIconModule,
} from "@nebular/theme";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import { AppRoutingModule } from "./app-routing.module";
import { LoginComponent } from "./components/login/login.component";
import { ChatsComponent } from "./components/chats/chats.component";
import { ConversationComponent } from "./components/conversation/conversation.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// frequent antique present skull method memory liberty crouch wrap dice verify joy
// npm install bip39 bitcore-mnemonic crypto-js ethereumjs-tx ethereumjs-util ethereumjs-wallet web3 --save
// ng add @nebular/theme

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatsComponent,
    ConversationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: "default" }),
    NbLayoutModule,
    NbEvaIconsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    RouterModule, // RouterModule.forRoot(routes, { useHash: true }), if this is your app.module
    NbLayoutModule,
    NbSidebarModule.forRoot(), // NbSidebarModule.forRoot(), //if this is your app.module
    NbButtonModule,
    NbChatModule,
    NbInputModule,
    NbCardModule,
    NbListModule,
    NbUserModule,
    NbIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
