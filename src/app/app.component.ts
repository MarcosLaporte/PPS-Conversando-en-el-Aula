import { Component, OnInit } from '@angular/core';
import { ToastWarning } from './utils';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router, public spinner: NgxSpinnerService) {
    const ssUser = sessionStorage.getItem('userInSession');
    this.auth.UserInSession = ssUser ? JSON.parse(ssUser) : null;
  }

  ngOnInit() {
    this.router.navigateByUrl('splash');
    window.addEventListener('storage', (e) => {
      if (e.storageArea === sessionStorage && e.key === 'userInSession') {
        this.auth.signOut();
        ToastWarning.fire('Hubo un problema con su sesión.', ' Ingrese nuevamente.');
        this.router.navigateByUrl('login');
      }
    });
  }
}
