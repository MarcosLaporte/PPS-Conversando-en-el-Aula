import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { Timestamp } from '@angular/fire/firestore';
import { User } from '../interfaces';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';

declare interface Message {
  id: string,
  message: string,
  sender: User,
  date: Date
}
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  colName = 'messages-';
  messages: Message[] = [];
  msgText: string = '';

  constructor(private navCtrl: NavController, private auth: AuthService, private db: DatabaseService, private spinner: NgxSpinnerService) {
    const navigation = inject(Router).getCurrentNavigation();
    const groupChat: string = navigation?.extras?.state?.['groupChat'];

    if (!groupChat) this.navCtrl.navigateRoot(['/home']);
    this.colName += groupChat;
  }

  ngOnInit() {
    this.spinner.show();
    this.db.listenColChanges<Message>(
      this.colName,
      this.messages,
      undefined,
      (m1, m2) => m1.date > m2.date ? 1 : -1,
      this.timestampParse,
    );

    setTimeout(() => {
      this.spinner.hide();
    }, 3000);
  }

  readonly timestampParse = async (msg: Message) => {
    msg.date = msg.date instanceof Timestamp ? msg.date.toDate() : msg.date;
    return msg;
  }

  currentUserIsSender = (msg: Message) => msg.sender.email === this.auth.UserInSession!.email;
  
  sendMessage() {
    if (this.auth.UserInSession && this.msgText !== "") {
      const newMsg = {
        id: '',
        message: this.msgText,
        sender: this.auth.UserInSession,
        date: new Date()
      };

      this.db.addData(this.colName, newMsg, true);
      this.msgText = "";
    }
  }
}
