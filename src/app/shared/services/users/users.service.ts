import { Injectable } from '@angular/core';
import { NotificationService } from '../notifications/notification.service';
import { HttpClient } from "@angular/common/http";
import { UserInfo } from "../../models/auth.interface";

const BASE_URL = 'http://localhost:8086';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  model = 'api/users';

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
    return this.http.post<any>(this.getUrl(), user);
  }

  updateUser(user: UserInfo) {
    return this.http.put<any>(this.getUrl(), user);
  }

  deleteUser(id: number) {
    return this.http.delete<any>(this.getUrlWithID(id));
  }

  private getUrl() {
    return `${BASE_URL}/${this.model}`;
  }

  private getUrlWithID(id: any) {
    return `${this.getUrl()}/${id}`;
  }
  getOwnersOfServer(id:number) {
    return this.http.get<UserInfo[]>(this.getUrl()+"/ownersOfServer/"+id);
  }

  getNotOwnersOfServer(id:number) {
    return this.http.get<UserInfo[]>(this.getUrl()+"/notOwnersOfServer/"+id);
  }
}
