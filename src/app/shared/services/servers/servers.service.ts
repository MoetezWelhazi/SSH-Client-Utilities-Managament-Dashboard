import { Injectable } from '@angular/core';
import { NotificationService } from '../notifications/notification.service';
import { HttpClient } from "@angular/common/http";
import { ServerInfo } from "../../models/server.interface";

const BASE_URL = 'http://localhost:8081';


@Injectable({
  providedIn: 'root'
})
export class ServersService {
  model = 'api/Server';

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  getAllServers(displayNotification: boolean) {
    if (displayNotification) {
      this.notificationService.notify('Get All Servers HTTP Call');
    }
    return this.http.get<ServerInfo[]>(this.getUrl());
  }

  createServer(user: ServerInfo) {
    return this.http.post<any>(this.getUrl(), user);
  }

  updateServer(user: ServerInfo) {
    return this.http.put<any>(this.getUrl(), user);
  }

  deleteServer(id: number) {
    return this.http.delete<any>(this.getUrlWithID(id));
  }

  private getUrl() {
    return `${BASE_URL}/${this.model}`;
  }

  private getUrlWithID(id: any) {
    return `${this.getUrl()}/${id}`;
  }

}
