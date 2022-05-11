import { Component, OnInit } from '@angular/core';
import {UserInfo} from "../../shared/models/auth.interface";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {GroupInterface} from "../../shared/models/group.interface";

@Component({
  selector: 'app-addgroupform',
  templateUrl: './addgroupform.component.html',
  styleUrls: ['./addgroupform.component.css']
})
export class AddgroupformComponent implements OnInit {

  group: GroupInterface = {
    name:"",
    description:""
  };

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit(): void {
  }

  addGroup() {
    this.ref.close(this.group);
  }

  cancel(){
    this.ref.close();
  }

}
