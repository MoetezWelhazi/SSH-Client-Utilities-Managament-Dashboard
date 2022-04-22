import { Injectable } from '@angular/core';
import {HttpClient, HttpRequest} from "@angular/common/http";
import {NotificationService} from "../notifications/notification.service";
import {Script} from "../../models/script.interface";
import {Execution} from "../../models/execHistory.interface";
import {Upload} from "../../models/upload.interface";

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

  executeScript(execution: Execution){
    return this.http.post<any>(this.getUrlWithID(execution.executorId),execution)
  }

  getScriptsDetails(userId: any){
    return this.http.get<Script[]>(this.getUrlWithID(userId))
  }

  getAllScripts(displayNotification: boolean) {
    if (displayNotification) {
      this.notificationService.notify('Get All Scripts HTTP Call');
    }
    return this.http.get<Script[]>(this.getUrl());
  }

  createScript(upload: Upload) {
    //.notificationService.notify('Create Script HTTP Call');
    const formData: FormData = new FormData();
    //@ts-ignore
    formData.append('file', upload.file);
    formData.append('user_id', upload.id);
    formData.append('description', upload.script.description);
    formData.append('editable',upload.script.editable ? "true": "false");
    const req = new HttpRequest('POST', this.getUrl(), formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request<any>(req);
    //return this.http.post<Script>(this.getUrl(), script);
  }

  updateScript(script: Script) {
    //this.notificationService.notify('Update Script HTTP Call');
    return this.http.put<any>(this.getUrlWithID(window.sessionStorage.getItem("auth-token")), script);
  }

  shareScript(sId:any, uId:any){
    return this.http.put<any>(this.getUrlWithID(sId),uId);
  }

  deleteScript(id: number) {
    //this.notificationService.notify('Delete Script HTTP Call');
    return this.http.delete<any>(this.getUrlWithID(id));
  }

  private getUrl() {
    return `${BASE_URL}/${this.model}`;
  }

  private getUrlWithID(id:any) {
    return `${this.getUrl()}/${id}`;
  }
}
