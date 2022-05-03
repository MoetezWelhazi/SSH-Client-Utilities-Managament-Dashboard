import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Execution } from "../../shared/models/execHistory.interface";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Script } from "../../shared/models/script.interface";
import { Message } from '@stomp/stompjs';
import { ScriptsService } from "../../shared/services/scripts/scripts.service";
import { MessageService } from "primeng/api";
import { RxStompService } from "../../shared/services/websocket/rxstomp.service";


@Component({
  selector: 'app-execute-script',
  templateUrl: './execute-script.component.html',
  styleUrls: ['./execute-script.component.scss']
})
export class ExecuteScriptComponent implements OnInit {
  public executionProgress: any ={}

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
  command: string = "";
  args = [""];
  nArgs = 0


  constructor(@Inject(MAT_DIALOG_DATA) public data: {script: Script, id:any, args: any},
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
      this.console=data.body;
    },
    err=>{
      console.log("JOE BIDEN, WAKE UP(error message): ",err.message)
    })
    //console.log("DATA.ID: "+this.data.id)
    //console.log("DATA.SCRIPT: "+this.data.script.name)
    this.execution.scriptId = this.data.script.id;
    this.execution.executorId = this.data.id;
  }
  ngAfterViewInit(){

  }

  executeScript() {
    this.execution.args= this.args.slice(1)
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

  addArg(arg: any) {
    if(!(this.data.args<=this.nArgs)){
      if (arg == "")
        this.messageService.add({severity: 'error', summary: 'Error', detail: "No argument in input!"})
      else { // @ts-ignore
        this.args.push(arg)
        this.nArgs = this.nArgs + 1
        //console.log("NARGS: "+this.nArgs+ " ARGS: "+this.data.args)
        this.command = this.args.join(" ")
      }
    }
    else this.messageService.add({severity: 'error', summary: 'Error', detail: "You have reached the argument limit!"})

  }

  removeArg() {
    if(this.nArgs>0){
      this.args.pop()
      this.nArgs = this.nArgs - 1
      this.command = this.args.join(" ")
    }
    else this.messageService.add({severity: 'error', summary: 'Error', detail: "No arguments to remove!"})
  }

  setCommand() {
    return
  }
}
