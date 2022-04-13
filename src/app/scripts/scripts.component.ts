import { Component, OnInit } from '@angular/core';
import {Script} from "../shared/models/script.interface";
import {Observable, of} from "rxjs";
import {ScriptsService} from "../shared/services/scripts/scripts.service";
import {tap} from "rxjs/operators";

@Component({
  selector: 'app-scripts',
  templateUrl: './scripts.component.html',
  styleUrls: ['./scripts.component.scss']
})
export class ScriptsComponent implements OnInit {

  scripts$: Observable<Script[]>
  selectedScript: Script ={
    id:undefined,
    name:"",
    description:""
  };

  constructor(private scriptsService: ScriptsService) {
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
      this.createScript(script);
    }
    this.resetScript();
  }

  updateScript(script: Script) {
    this.scriptsService.updateScript(script).pipe(
      tap(() => this.loadScripts(false))
    ).subscribe();
  }

  createScript(script: Script) {
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
      author: '',
      //createdAt: new Date()
    };

    this.selectScript(emptyScript);
  }

}
