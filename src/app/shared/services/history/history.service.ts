import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Execution } from '../../models/execution';
import {TokenStorageService} from "../auth/token-storage.service";
const BASE_URL = 'http://localhost:8086';
@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  model = 'api/history';

  constructor(   private http: HttpClient,
                 private tokenStorageService: TokenStorageService
  ) { }

  getUserHistory(){
    return this.http.get<Execution[]>(this.getUrl()+"/user/"+this.tokenStorageService.getUser().id)
  }

  getAll()
  {
    return this.http.get<any>(this.getUrl());
  }

  getById(id: number)
  {
    return this.http.get<Execution>(this.getUrlWithID(id));
  }

  private getUrl() {
    return `${BASE_URL}/${this.model}`;
  }

  private getUrlWithID(id:any) {
    return `${this.getUrl()}/${id}`;
  }


}
