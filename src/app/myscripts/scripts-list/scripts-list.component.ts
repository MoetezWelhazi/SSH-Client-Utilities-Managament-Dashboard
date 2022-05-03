import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Script} from "../../shared/models/script.interface";
import {Table} from "primeng/table";

@Component({
  selector: 'app-myscripts-list',
  templateUrl: './scripts-list.component.html',
  styleUrls: ['./scripts-list.component.scss']
})
export class ScriptsListComponent implements OnInit {

  @Input() scripts: Script[] | any  = [];
  @Output() scriptSelected = new EventEmitter<Script>();
  @Output() scriptRemoved = new EventEmitter<number>();

  selectedScript: Script = {name:"",description:""}

  @ViewChild('dt') table: Table | undefined;


  constructor() {}

  ngOnInit(): void {}

  selectScript(script: any) {
    console.log("THIS SCRIPT WAS SELECTED: "+JSON.stringify(script))
    this.scriptSelected.emit(script);
  }

  removeScript(id: any) {
    this.scriptRemoved.emit(id);
  }

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

}
