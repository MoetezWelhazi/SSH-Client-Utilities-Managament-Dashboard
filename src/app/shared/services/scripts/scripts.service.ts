import { Injectable } from '@angular/core';
import {HttpClient, HttpRequest} from "@angular/common/http";
import {NotificationService} from "../notifications/notification.service";
import {Script} from "../../models/script.interface";
import {Execution} from "../../models/execHistory.interface";
import {Upload} from "../../models/upload.interface";
import {ScriptShare} from "../../models/share.interface";

const BASE_URL = 'http://localhost:8086';

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

  getPersonalScripts(userId: any){
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
    formData.append('type', upload.script.type);
    formData.append('editable',upload.script.editable ? "true": "false");
    console.log("UPLOAD: "+JSON.stringify(upload))
    const req = new HttpRequest('POST', this.getUrl(), formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request<any>(req);
    //return this.http.post<Script>(this.getUrl(), script);
  }

  updateScript(script: Script) {
    //this.notificationService.notify('Update Script HTTP Call');
    return this.http.put<any>(this.getUrl(), script);
  }

  shareScript(sId:any, share:ScriptShare){
    //console.log("SCRIPT SHARE (ScriptsService): "+JSON.stringify(share))
    return this.http.put<any>(this.getUrl()+"/share/"+sId,share);
  }

  deleteScript(id: number) {
    //this.notificationService.notify('Delete Script HTTP Call');
    return this.http.delete<any>(this.getUrlWithID(id));
  }

  removeScript(sId: any, uId: any){
    return this.http.delete<any>(this.getUrlWithID(uId)+"/"+sId)
  }

  private getUrl() {
    return `${BASE_URL}/${this.model}`;
  }

  private getUrlWithID(id:any) {
    return `${this.getUrl()}/${id}`;
  }
}
