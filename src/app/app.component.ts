import {Component, OnInit} from '@angular/core';
import { shareReplay } from 'rxjs/operators';

import { AuthService } from './shared/services/auth/auth.service';
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  isExpanded : boolean = true
  title = 'DGU';
  user = {roles:["ROLE_USER"]}
  links = [{ path: '/home', icon: 'home', title: 'Home', admin: false},
    { path: '/myscripts' , icon : "terminal" , title : 'My Scripts', admin:false},
    { path: '/allscripts' , icon : "terminal" , title : 'All Scripts', admin:false},
    { path: '/history' , icon : "history" , title : 'History', admin:true},
    { path: '/servers' , icon : "dns" , title : 'Servers', admin:true},
    { path: '/users', icon: 'person', title: 'Users' , admin:true},
    { path: '/groups', icon: 'group', title: 'Groups', admin:true}
    ];

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

  getTitle(title: string) {
    if(this.isExpanded)
      return title
    else return ""

  }

  ngOnInit(): void {
    document.body.classList.add('users-background');
  }
}
