import { Component } from '@angular/core';
import { shareReplay } from 'rxjs/operators';

import { AuthService } from './shared/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'DGU';
  links = [
    { path: '/home', icon: 'home', title: 'Home' },
    { path: '/users', icon: 'people', title: 'Users' },
    { path : '/servers' , icon : "dns" , title : 'Servers'},
    { path : '/scripts' , icon : "terminal" , title : 'Scripts'}
  ];

  isAuthenticated$ = this.authService.isAuthenticated$.pipe(shareReplay(1));

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
