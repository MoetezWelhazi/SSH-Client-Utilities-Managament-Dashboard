import {Component, OnInit} from '@angular/core';
import { shareReplay } from 'rxjs/operators';

import { AuthService } from './shared/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent{
  title = 'DGU';
  user = {roles:["ROLE_USER"]}
  links = [{ path: '/home', icon: 'home', title: 'Home', admin: false},
    { path: '/myscripts' , icon : "terminal" , title : 'My Scripts', admin:false},
    { path: '/users', icon: 'people', title: 'Users' , admin:true},
    { path: '/servers' , icon : "dns" , title : 'Servers', admin:true},
    { path: '/allscripts' , icon : "terminal" , title : 'Scripts', admin:false},
    { path: '/history' , icon : "history" , title : 'History', admin:false},];

  isAuthenticated$ = this.authService.isAuthenticated$.pipe(shareReplay(1));

  constructor(private authService: AuthService) {
    if(!this.isAuthenticated$)
      window.sessionStorage.setItem("auth-user", JSON.stringify(this.user));
  }

  logout() {
    this.authService.logout();
  }

  isAdmin():boolean{



    // @ts-ignore
    return JSON.parse(window.sessionStorage.getItem("auth-user"))?.roles.includes("ROLE_ADMIN") ?? false;
  }


}
