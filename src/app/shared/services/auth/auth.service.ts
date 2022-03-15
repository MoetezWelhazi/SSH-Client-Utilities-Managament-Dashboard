import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { UserInfo } from '../../interfaces/auth.interface';

const AUTHENTICATION_KEY = 'workshop:authenticated';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject(this.getIsAuthenticated() || false);
  isAuthenticated$ = this.isAuthenticated.asObservable();

  constructor(private router: Router) { }

  login(userInfo: UserInfo) {
    this.setIsAuthenticated(true);
    this.isAuthenticated.next(true);
    this.router.navigateByUrl('/home');
  }

  logout() {
    this.setIsAuthenticated(false);
    this.isAuthenticated.next(false);
    this.router.navigateByUrl('/auth');
  }

  register(userInfo:UserInfo){
    console.log("NEW USER: "+userInfo.email+"\n HAS BEEN REGISTERED!")
  }

  private getIsAuthenticated(): boolean {
    // @ts-ignore
    return JSON.parse(localStorage.getItem(AUTHENTICATION_KEY));
  }

  private setIsAuthenticated(isAuthenticated: boolean) {
    localStorage.setItem(AUTHENTICATION_KEY, JSON.stringify(isAuthenticated));
  }
}
