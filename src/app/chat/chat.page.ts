import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { Timestamp } from '@angular/fire/firestore';
import { User } from '../interfaces';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { Keyboard } from '@capacitor/keyboard';

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
export class ChatPage implements OnInit, OnDestroy {
  colName = 'messages-';
  messages: Message[] = [];
  msgText: string = '';

  constructor(private navCtrl: NavController, private auth: AuthService, private db: DatabaseService, private spinner: NgxSpinnerService) {
    const navigation = inject(Router).getCurrentNavigation();
    const groupChat: string = navigation?.extras?.state?.['groupChat'];

    if (!groupChat) this.navCtrl.navigateRoot(['/home']);
    this.colName += groupChat;
  }

  async ngOnInit() {
    this.spinner.show();
    this.db.listenColChanges<Message>(
      this.colName,
      this.messages,
      undefined,
      (m1, m2) => m1.date > m2.date ? 1 : -1,
      this.timestampParse,
    );

    const messagesContainer = document.getElementById('messages')!;
    const observer = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(async (node: any) => {
            if (node.nodeType === 1 && node.classList.contains('msg')) {
                await this.delay(250);
                (node as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'end' });
                new Audio('../../assets/sounds/notification.mp3').play();
            }
          });
        }
      }
    });

    const config = { childList: true, subtree: true };
    observer.observe(messagesContainer, config);

    await this.delay(3000);
    this.spinner.hide();
    this.scrollToLastMsg();

    Keyboard.addListener('keyboardWillShow', (info) => {
      this.scrollToLastMsg();
    });
  }

  ngOnDestroy() {
    Keyboard.removeAllListeners();
  }

  readonly timestampParse = async (msg: Message) => {
    msg.date = msg.date instanceof Timestamp ? msg.date.toDate() : msg.date;
    return msg;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  scrollToLastMsg() {
    const elements = document.getElementsByClassName('msg');
    const lastElement: any = elements[elements.length - 1];
    const toppos = lastElement.offsetTop;
    document.getElementById('messages')!.scrollTop = toppos;
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
