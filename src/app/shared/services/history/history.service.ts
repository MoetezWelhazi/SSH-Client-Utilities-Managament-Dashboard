import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Execution } from '../../models/execution';
const BASE_URL = 'http://localhost:8081/api/history';
@Injectable({
  providedIn: 'root'
})
export class HistoryService {


  constructor(   private http: HttpClient) { }

  getAll()
  {
    return this.http.get<Execution[]>(BASE_URL);
  }

  getById(id: number)
  {
    return this.http.get<Execution>(BASE_URL+"/"+id);
  }

  
}
