import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { Execution } from "../../shared/models/execHistory.interface";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Script } from "../../shared/models/script.interface";
import { Message } from '@stomp/stompjs';
import { ScriptsService } from "../../shared/services/scripts/scripts.service";
import { MessageService } from "primeng/api";
import { RxStompService } from "../../shared/services/websocket/rxstomp.service";
import {ServersService} from "../../shared/services/servers/servers.service";
import {ServerInfo} from "../../shared/models/server.interface";


@Component({
  selector: 'app-execute-script',
  templateUrl: './execute-script.component.html',
  styleUrls: ['./execute-script.component.scss']
})
export class ExecuteScriptComponent implements OnInit {
  hide=true;
  console: string = "Press Execute to run the script...";
  execution: Execution = {
    user:'',
    port:22,
    serverId:0,
    password:'',
    executorId:0,
  }
  selectedServer = '';
  servers?: ServerInfo[]
  command: string = "";
  args = [""];
  nArgs = 0

  constructor(@Inject(MAT_DIALOG_DATA) public data: {script: Script, id:any, args: any},
              public dialogRef: MatDialogRef<ExecuteScriptComponent>,
              private executionWebsocketService: RxStompService,
              private scriptsService: ScriptsService,
              private serversService: ServersService,
              private clipboard: Clipboard,
              private messageService:MessageService,
              ) {}

  onChange(event:any){
    console.log(event)
    this.execution.user = event.value.login
    this.execution.password = event.value.password
    this.execution.serverId = event.value.id;
    console.log(this.execution)
  }

  ngOnInit(): void {
    let destination = '/script/execution/'+this.data.id;
    this.executionWebsocketService.activate()
    this.executionWebsocketService.watch(destination).subscribe((data:Message)=>{
      this.console=data.body;
    },
    err=>{
      console.log("JOE BIDEN, WAKE UP(error message): ",err.message)
    })
    console.log("STOMP IS LISTENING TO: "+destination);
    this.execution.scriptId = this.data.script.id;
    this.execution.executorId = this.data.id;
    this.serversService.getAllServers(false).subscribe(
      {
        next:(data)=>{
          this.servers = data;
        },
        error:err=>{
          this.messageService.add({severity:"error",summary:"Error",detail:err.message})
        }
      }
    )
  }
  ngAfterViewInit(){

  }

  executeScript() {
    this.execution.args= this.command
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

  copyTerminal(text:string) {
    this.clipboard.copy(text);
    this.messageService.add({severity:"info", summary:"Console Copied", detail:"Contents copied"})
  }

  disconnect() {
    this.executionWebsocketService.deactivate().then(result =>{
      this.dialogRef.close()
      }
    )
  }
}
