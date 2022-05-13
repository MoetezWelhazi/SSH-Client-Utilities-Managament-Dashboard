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
  isExpanded : boolean = false
  marginLeft : any = ""
  title = 'DGU';
  user = {roles:["ROLE_USER"]}
  links = [{ path: '/home', icon: 'home', title: 'Home', admin: false},
    { path: '/myscripts' , icon : "terminal" , title : 'My Scripts', admin:false},
    { path: '/allscripts' , icon : "terminal" , title : 'All Scripts', admin:false},
    { path: '/history' , icon : "history" , title : 'History', admin:true},
    { path: '/servers' , icon : "dns" , title : 'Servers', admin:false},
    { path: '/users', icon: 'people', title: 'Users' , admin:true},
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

  openClose(){
    this.isExpanded = !this.isExpanded
    //console.log("EXPANDED: "+this.isExpanded)

    if(this.isExpanded) {
      // @ts-ignore
      document.getElementById("sidenav").classList.remove('animate-hide');
      // @ts-ignore
      document.getElementById("container").classList.remove('re-adjustC-container-mat');
      // @ts-ignore
      document.getElementById("sidenav").classList.add('animate-show');
      // @ts-ignore
      document.getElementById("container").classList.add('re-adjustO-container-mat');
    }
    else{
      // @ts-ignore
      document.getElementById("sidenav").classList.remove('animate-show');
      // @ts-ignore
      document.getElementById("container").classList.remove('re-adjustO-container-mat');
      // @ts-ignore
      document.getElementById("sidenav").classList.add('animate-hide');
      this.marginLeft=""
      // @ts-ignore
      document.getElementById("container").classList.add('re-adjustC-container-mat');

    }

  }


  ngOnInit(): void {
    document.body.classList.add('users-background');
    this.openClose()
  }
}
