import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NotificationService} from "../notifications/notification.service";
import {Script} from "../../interfaces/script.interface";

const BASE_URL = 'http://localhost:8081';

@Injectable({
  providedIn: 'root'
})
export class ScriptsService {

  model = 'api/scripts';

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  getAllScripts(displayNotification: boolean) {
    if (displayNotification) {
      this.notificationService.notify('Get All Scripts HTTP Call');
    }
    return this.http.get<Script[]>(this.getUrl());
  }

  createScript(script: Script) {
    this.notificationService.notify('Create Script HTTP Call');
    return this.http.post<Script>(this.getUrl(), script);
  }

  updateScript(script: Script) {
    this.notificationService.notify('Update Script HTTP Call');
    return this.http.put<Script>(this.getUrlWithID(script.id), script);
  }

  deleteScript(id: number) {
    this.notificationService.notify('Delete Script HTTP Call');
    return this.http.delete(this.getUrlWithID(id));
  }

  private getUrl() {
    return `${BASE_URL}/${this.model}`;
  }

  private getUrlWithID(id:any) {
    return `${this.getUrl()}/${id}`;
  }
}
