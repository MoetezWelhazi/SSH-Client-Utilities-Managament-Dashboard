import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import { FunctionsUsingCSI, NgTerminal } from 'ng-terminal';
import { Execution } from "../../shared/models/execHistory.interface";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Script} from "../../shared/models/script.interface";
import { Message } from '@stomp/stompjs';
import {ScriptsService} from "../../shared/services/scripts/scripts.service";
import {MessageService} from "primeng/api";
import {RxStompService} from "../../shared/services/websocket/rxstomp.service";


@Component({
  selector: 'app-execute-script',
  templateUrl: './execute-script.component.html',
  styleUrls: ['./execute-script.component.scss']
})
export class ExecuteScriptComponent implements OnInit {
  public executionProgress: any ={}
  // @ts-ignore
  //@ViewChild('term', { static: true }) child: NgTerminal;
  hide=true;
  console: string = "Press Execute to run the script...";
  execution: Execution = {
    user:'',
    port:22,
    server:'',
    password:'',
    executorId:0,
  }
  selectedServer = '';

  servers = [
    { id: '192.168.56.101', name: 'linux mint VM' },
    { id: '2', name: 'server 2' },
    { id: '3', name: 'server 3' },
    { id: '4', name: 'server 4' }
  ];


  constructor(@Inject(MAT_DIALOG_DATA) public data: {script: Script, id:any},
              public dialogRef: MatDialogRef<ExecuteScriptComponent>,
              private executionWebsocketService: RxStompService,
              private scriptsService: ScriptsService,
              private messageService:MessageService,
              ) {

  }

  ngOnInit(): void {
    let destination = '/script/execution/'+this.data.id;
    console.log("STOMP IS LISTENING TO: "+destination);
    this.executionWebsocketService.watch(destination).subscribe((data:Message)=>{
      //console.log(data.body);
      this.console=data.body;
      //console.log("MESSAGE RECEIVED");
    },
    err=>{
      console.log("JOE BIDEN, WAKE UP(error message)")
    })
    console.log("DATA.ID: "+this.data.id)
    this.execution.executorId = this.data.id;
  }
  ngAfterViewInit(){

  }

  executeScript() {
    console.log(this.execution)
    this.scriptsService.executeScript(this.execution)
      .subscribe({
        next: (data)=>{
          this.messageService.add({severity:'success', summary:'Script Executed', detail:data.message})
        },
        error: (err)=>{
          this.messageService.add({severity:'error', summary:'Error',detail:err.error.message})
        }
      })
  }

  clearTerminal() {
    this.console="";
  }
}
