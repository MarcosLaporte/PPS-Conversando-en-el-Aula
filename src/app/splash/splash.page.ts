import { Component, OnInit, inject } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage {

  constructor(private navCtrl: NavController) {
    setTimeout(() => {
      const audio = new Audio('../../assets/sounds/key-glitch.mp3');
      audio.play();
    }, 3000);

    const route = inject(AuthService).UserInSession ? '/home' : '/login';
    setTimeout(() => {
      navCtrl.navigateRoot(route);
      history.pushState(null, '');
    }, 4500);
  }
}
