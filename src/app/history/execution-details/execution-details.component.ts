import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Script} from "../../shared/models/script.interface";
import {Clipboard} from "@angular/cdk/clipboard";
import {MessageService} from "primeng/api";
import {Execution} from "../../shared/models/execHistory.interface";
import { ExecuteScriptComponent } from 'src/app/myscripts/execute-script/execute-script.component';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {TokenStorageService} from "src/app/shared/services/auth/token-storage.service";
import { reexecuteComponent } from './re-execute/re-execute.component';

@Component({
  selector: 'app-execution-details',
  templateUrl: './execution-details.component.html',
  styleUrls: ['./execution-details.component.scss']
})
export class ExecutionDetailsComponent implements OnInit {

 

  selected: boolean = false;

  hide:boolean = true;
  currentScript: Script ={
    id:undefined,
    name:"",
    description:"",
    code:"",
    type:true
  };

  execution: Execution = {
    user:'',
    port:22,
    serverId:0,
    password:'',
    executorId:0,
  }


  constructor(@Inject(MAT_DIALOG_DATA) public data: {execution: Execution},
              public dialogRef: MatDialogRef<ExecutionDetailsComponent>,
              private clipboard: Clipboard,
              private messageService:MessageService,
              private tokenStorageService: TokenStorageService,
              public dialog: MatDialog,
              public dialogRef1: MatDialogRef<ExecutionDetailsComponent>,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.execution = this.data.execution
  }
  copyTerminal(text:any) {
    this.clipboard.copy(text);
    this.messageService.add({severity:"info", summary:"Console Copied", detail:"Contents copied"})
  }

  reExecuteScript(Execution:Execution) {
    

      const user = this.tokenStorageService.getUser();
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.panelClass = "material-popup"
      dialogConfig.data = {script: this.currentScript, id: user.id, args: this.currentScript.args , execution: Execution };
      let dialogRef1=this.dialog.closeAll();
      let dialogRef = this.dialog.open(reexecuteComponent, dialogConfig);
     
    
    
  }
}
