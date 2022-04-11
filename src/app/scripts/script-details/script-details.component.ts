import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Script} from "../../shared/interfaces/script.interface";

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
    code:"#!/bin/bash\n" +
      "\n" +
      "# testLOCAL.sh\n" +
      "ping 192.168.1.7 -c 5 "
  };

  constructor() {}

  ngOnInit(): void {}

  saveScript(script: Script) {
    this.scriptSaved.emit(script);
  }

  cancelScript() {
    this.scriptCancelled.emit();
  }

}
