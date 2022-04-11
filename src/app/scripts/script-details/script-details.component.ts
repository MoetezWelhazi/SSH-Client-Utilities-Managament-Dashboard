import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Script} from "../../shared/interfaces/script.interface";
import {DialogService} from "primeng/dynamicdialog";
import {NotificationService} from "../../shared/services/notifications/notification.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {ExecuteScriptComponent} from "../execute-script/execute-script.component";

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

  constructor(public dialogService: DialogService,
              private notificationService: NotificationService,
              public confirmationService: ConfirmationService,
              public messageService: MessageService,

              ) {}

  ngOnInit(): void {}

  saveScript(script: Script) {
    this.scriptSaved.emit(script);
  }

  cancelScript() {
    this.scriptCancelled.emit();
  }

  toExecute() {
    const ref = this.dialogService.open(ExecuteScriptComponent, {
      header: 'Execute Script',
      width: '70%'
    })
  }
}
