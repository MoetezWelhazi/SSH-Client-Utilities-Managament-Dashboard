import { Injectable } from '@angular/core';
import { NotificationService } from '../notifications/notification.service';
import { HttpClient } from "@angular/common/http";
import { GroupInterface } from "../../models/group.interface";

const BASE_URL = 'http://localhost:8081';


@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  model = 'api/groups';

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  getAllGroups(displayNotification: boolean) {
    if (displayNotification) {
      this.notificationService.notify('Get All Groups HTTP Call');
    }
    return this.http.get<GroupInterface[]>(this.getUrl());
  }

  createGroup(group: GroupInterface) {
    return this.http.post<any>(this.getUrl(), group);
  }

  updateGroup(group: GroupInterface) {
    return this.http.put<any>(this.getUrl(), group);
  }

  deleteGroup(id: number) {
    return this.http.delete<any>(this.getUrlWithID(id));
  }

  addToGroup(gid:any,uid:any){
    return this.http.put<any>(this.getUrlWithID(gid), {ids:[uid]})
  }

  removeFromGroup(gid:number,uid:any){
    return this.http.put<any>(this.getUrlWithID(gid)+"/delete", {ids:[uid]})
  }

  private getUrl() {
    return `${BASE_URL}/${this.model}`;
  }

  private getUrlWithID(id: any) {
    return `${this.getUrl()}/${id}`;
  }
  getOwnersOfServer(id:number) {
    return this.http.get<GroupInterface[]>(this.getUrl()+"/ownersOfServer/"+id);
  }

  getNotOwnersOfServer(id:number) {
    return this.http.get<GroupInterface[]>(this.getUrl()+"/notOwnersOfServer/"+id);
  }
}
