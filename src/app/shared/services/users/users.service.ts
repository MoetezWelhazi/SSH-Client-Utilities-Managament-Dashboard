import { Injectable } from '@angular/core';
import { NotificationService } from '../notifications/notification.service';
import { HttpClient } from "@angular/common/http";
import { UserInfo } from "../../interfaces/auth.interface";

const BASE_URL = 'http://localhost:3000';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  model = 'users';

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  getAllUsers(displayNotification: boolean) {
    if (displayNotification) {
      this.notificationService.notify('Get All Users HTTP Call');
    }

    return this.http.get<UserInfo[]>(this.getUrl());
  }

  createUser(user: UserInfo) {
    this.notificationService.notify('Create User HTTP Call');
    return this.http.post<UserInfo>(this.getUrl(), user);
  }

  updateUser(user: UserInfo) {
    this.notificationService.notify('Update User HTTP Call');
    return this.http.put<UserInfo>(this.getUrlWithID(user.email), user);
  }

  deleteUser(id: number) {
    this.notificationService.notify('Delete User HTTP Call');
    return this.http.delete(this.getUrlWithID(id));
  }

  private getUrl() {
    return `${BASE_URL}/${this.model}`;
  }

  private getUrlWithID(id: any) {
    return `${this.getUrl()}/${id}`;
  }

}
