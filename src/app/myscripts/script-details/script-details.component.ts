import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Script} from "../../shared/models/script.interface";
import {DialogService} from "primeng/dynamicdialog";
import {NotificationService} from "../../shared/services/notifications/notification.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {ExecuteScriptComponent} from "../execute-script/execute-script.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {TokenStorageService} from "../../shared/services/auth/token-storage.service";
import * as ace from "ace-builds";

@Component({
  selector: 'app-myscript-details',
  templateUrl: './script-details.component.html',
  styleUrls: ['./script-details.component.css']
})
export class ScriptDetailsComponent implements OnInit,AfterViewInit {

  @Input() set selectedScript(value: Script) {
    if (value?.name) {
      this.originalTitle = value.name;
    }
    this.currentScript = Object.assign({}, value);
    this.aceEditor.session.setValue(this.currentScript.code);
    //console.log(JSON.stringify(this.currentScript))
    if(!this.currentScript.editable){
      if(!this.isAdmin()){
        console.log("THIS USER IS NOT AN ADMIN!")
        if(this.currentScript.author!=this.getTrigram()){
          this.aceEditor.setReadOnly(true)
          this.readOnly = true;
          console.log("THIS USER IS AUTHORIZED TO EDIT")
        }
      }
    }else if(this.currentScript.editable){
      if(!this.isAdmin()){
        console.log("THIS USER IS NOT AN ADMIN!")
        if(this.currentScript.author!=this.getTrigram()){
          this.readOnlyC = true;
          console.log("THIS USER IS NOT AUTHORIZED TO EDIT")
        }
      }
    }

  }
  @Output() scriptSaved = new EventEmitter<Script>();
  @Output() scriptCancelled = new EventEmitter();

  readOnly: boolean = false;
  readOnlyC: boolean = false;

  originalTitle: string = "";
  currentScript: Script ={
    id:undefined,
    name:"",
    description:"",
    code:"",
    type:true
  };
  //@ts-ignore
  @ViewChild("editor") private editor: ElementRef<HTMLElement>;

  private aceEditor: any ;

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
              public dialog: MatDialog,
              private tokenStorageService: TokenStorageService

              ) {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    ace.config.set("fontSize", "14px");
    ace.config.set(
      "basePath",
      "https://unpkg.com/ace-builds@1.4.14/src-noconflict"
    );
    this.aceEditor = ace.edit(this.editor.nativeElement);
    this.aceEditor.session.setValue("Select a script...");
    //ace-builds@1.4.14
    this.aceEditor.setTheme('ace/theme/eclipse');
    this.aceEditor.session.setMode('ace/mode/sh');
  }

  saveScript(script: Script) {
    this.currentScript.type = this.currentScript.type ? "Private" : "Public"
    this.currentScript.code = this.aceEditor.session.getValue()
    this.currentScript.update = "content"
    this.scriptSaved.emit(script);
  }

  cancelScript() {
    this.scriptCancelled.emit();
  }

  isAdmin():boolean{
    // @ts-ignore
    return JSON.parse(window.sessionStorage.getItem("auth-user")).roles.includes("ROLE_ADMIN")
  }

  getTrigram():string{
    // @ts-ignore
    return JSON.parse(window.sessionStorage.getItem("auth-user")).trigramme
  }

  toExecute() {
    const user = this.tokenStorageService.getUser();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { script: this.currentScript, id: user.id };
    let dialogRef = this.dialog.open(ExecuteScriptComponent, dialogConfig);
  }
}
