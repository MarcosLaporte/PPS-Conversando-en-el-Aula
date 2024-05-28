import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

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
    setTimeout(() => {
      navCtrl.navigateRoot('/login');
      history.pushState(null, '');
    }, 4600);
  }
}
