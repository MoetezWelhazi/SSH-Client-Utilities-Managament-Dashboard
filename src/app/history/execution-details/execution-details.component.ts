import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Script} from "../../shared/models/script.interface";
import {Clipboard} from "@angular/cdk/clipboard";
import {MessageService} from "primeng/api";
import {Execution} from "../../shared/models/execHistory.interface";

@Component({
  selector: 'app-execution-details',
  templateUrl: './execution-details.component.html',
  styleUrls: ['./execution-details.component.scss']
})
export class ExecutionDetailsComponent implements OnInit {

  hide:boolean = true;

  execution: Execution = {
    user:'',
    port:22,
    serverId:0,
    password:'moetez',
    executorId:0,
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: {execution: Execution},
              public dialogRef: MatDialogRef<ExecutionDetailsComponent>,
              private clipboard: Clipboard,
              private messageService:MessageService,
  ) { }

  ngOnInit(): void {
    this.execution = this.data.execution
  }
  copyTerminal(text:any) {
    this.clipboard.copy(text);
    this.messageService.add({severity:"info", summary:"Console Copied", detail:"Contents copied"})
  }

  reExecuteScript() {

  }
}
