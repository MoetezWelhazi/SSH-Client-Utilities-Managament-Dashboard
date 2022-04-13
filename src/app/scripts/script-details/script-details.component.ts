import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Script} from "../../shared/models/script.interface";
import {DialogService} from "primeng/dynamicdialog";
import {NotificationService} from "../../shared/services/notifications/notification.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {ExecuteScriptComponent} from "../execute-script/execute-script.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";

@Component({
  selector: 'app-script-details',
  templateUrl: './script-details.component.html',
  styleUrls: ['./script-details.component.css']
})
export class ScriptDetailsComponent implements OnInit {

  @Input() set selectedScript(value: Script) {
    if (value?.name) {
      this.originalTitle = value.name;
    }
    this.currentScript = Object.assign({}, value);
  }
  @Output() scriptSaved = new EventEmitter<Script>();
  @Output() scriptCancelled = new EventEmitter();

  originalTitle: string = "";
  currentScript: Script ={
    id:undefined,
    name:"",
    description:"",
    code:"",
  };

  orders = [
    { id: '1', name: 'order 1' },
    { id: '2', name: 'order 2' },
    { id: '3', name: 'order 3' },
    { id: '4', name: 'order 4' }
  ];

  constructor(public dialogService: DialogService,
              private notificationService: NotificationService,
              public confirmationService: ConfirmationService,
              public messageService: MessageService,
              public dialog: MatDialog

              ) {}

  ngOnInit(): void {}

  saveScript(script: Script) {
    this.scriptSaved.emit(script);
  }

  cancelScript() {
    this.scriptCancelled.emit();
  }

  toExecute() {
    /*const ref = this.dialogService.open(ExecuteScriptComponent, {
      header: 'Execute Script',
      width: '70%'
    })*/
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { script: this.selectedScript };
    let dialogRef = this.dialog.open(ExecuteScriptComponent, dialogConfig);
  }
}
