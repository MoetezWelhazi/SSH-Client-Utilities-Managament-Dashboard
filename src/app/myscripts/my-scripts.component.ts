import { Component, OnInit } from '@angular/core';
import {Script} from "../shared/models/script.interface";
import {Observable, of} from "rxjs";
import {ScriptsService} from "../shared/services/scripts/scripts.service";
import {tap} from "rxjs/operators";
import {Upload} from "../shared/models/upload.interface";
import {ConfirmationService, MessageService} from "primeng/api";
import {NotificationService} from "../shared/services/notifications/notification.service";
import {DialogService} from "primeng/dynamicdialog";

@Component({
  selector: 'app-myscripts',
  templateUrl: './my-scripts.component.html',
  styleUrls: ['./my-scripts.component.scss']
})
export class MyScriptsComponent implements OnInit {

  scripts$: Observable<Script[]>
  selectedScript: Script ={
    id:undefined,
    name:"",
    description:""
  };

  constructor(
    private scriptsService: ScriptsService,
    private notificationService:NotificationService,
    public confirmationService:ConfirmationService ,
    public messageService: MessageService ,
    public dialogService: DialogService
              ) {
    this.scripts$ = of([{
      id:undefined,
      name:"",
      description:""
    }])
  }

  ngOnInit(): void {
    this.loadScripts(true);
    this.resetScript();
  }

  ngAfterViewInit() {
    document.body.classList.add('scripts-background');
  }

  ngOnDestroy() {
    document.body.classList.remove('scripts-background');
  }

  selectScript(script: Script) {
    this.selectedScript = script;
  }

  loadScripts(displayNotification: boolean) {
    this.scripts$ = this.scriptsService.getAllScripts(!displayNotification);
  }

  saveScript(script: Script) {
    if (script.id) {
      this.updateScript(script);
    } else {
      this.messageService.add({severity:"error",summary:"Select Script",detail:"Select a script to modify"})
    }
    this.resetScript();
  }

  updateScript(script: Script) {
    this.scriptsService.updateScript(script).pipe(
      tap(() => this.loadScripts(false))
    ).subscribe();
  }

  createScript(script: Upload) {
    this.scriptsService.createScript(script).pipe(
      tap(() => this.loadScripts(false))
    ).subscribe();
  }

  deleteScript(id: number) {
    this.scriptsService.deleteScript(id).pipe(
      tap(() => this.loadScripts(false))
    ).subscribe();
  }

  resetScript() {
    const emptyScript: Script = {
      id: undefined,
      flags: [{'-c':9}],
      command: '',
      name: '',
      description:'',
      owner: '',
      //createdAt: new Date()
    };

    this.selectScript(emptyScript);
  }

}
