import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }


    canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ):
      | Observable<boolean | UrlTree>
      | Promise<boolean | UrlTree>
      | boolean
      | UrlTree {
      return this.authService.isAuthenticated$.pipe(
        tap((isAuthenticated) => {
          if (!isAuthenticated) {
            this.router.navigateByUrl('/auth');
          }

          return isAuthenticated;
        })
      );
    }
  }
  /*
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.isLoggedIn()) {
      return true;
    }
    // navigate to login page as user is not authenticated
    this.router.navigateByUrl('/auth');
    return false;
  }

  public isLoggedIn(): boolean {
    if (!(window.sessionStorage.getItem('isLoggedIn') == "true")) {
      return false
    }
    return true;
  }
}*/
