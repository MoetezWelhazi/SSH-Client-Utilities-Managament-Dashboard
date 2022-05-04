import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ServerInfo } from 'src/app/shared/models/server.interface';

@Component({
  selector: 'app-add-server-form',
  templateUrl: './add-server-form.component.html',
  styleUrls: ['./add-server-form.component.css']
})
export class AddServerFormComponent implements OnInit {
  hide = false;
  private :boolean = false;
  serverInfo : ServerInfo  = {

    name : '',
    login :  '',
    password : '',
    description : '',
    type : "Public",

  }
  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit(): void {
  }


  addServer() {
    this.serverInfo.type = this.private ? "Private" : "Public"
    this.ref.close(this.serverInfo);
  }

  cancel(){
    this.ref.close();
  }
}
