import { Component } from '@angular/core';
import { Router } from '@angular/router';

declare type group = 'morning' | 'night';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private router: Router) { }

  openChat = (gc: group) => this.router.navigateByUrl('chat', { state: { groupChat: gc } });
}
