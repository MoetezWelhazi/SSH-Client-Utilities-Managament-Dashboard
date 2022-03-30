import { Component, OnInit } from '@angular/core';
import {UserInfo} from "../../shared/interfaces/auth.interface";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
  selector: 'app-adduserform',
  templateUrl: './adduserform.component.html',
  styleUrls: ['./adduserform.component.css']
})
export class AdduserformComponent implements OnInit {
  isAdmin = false;

  hide = true;

  userInfo: UserInfo = {
    email: '',
    password: '',
    trigramme: '',
    roles: [],
  };

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit(): void {
  }

  addUser() {
    this.userInfo.roles = [ this.isAdmin? "admin": ""];
    this.ref.close(this.userInfo);
  }

  cancel(){
    this.ref.close();
  }

}
