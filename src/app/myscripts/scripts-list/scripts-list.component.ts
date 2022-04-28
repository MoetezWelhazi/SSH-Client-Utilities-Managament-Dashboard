import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Script} from "../../shared/models/script.interface";

@Component({
  selector: 'app-myscripts-list',
  templateUrl: './scripts-list.component.html',
  styleUrls: ['./scripts-list.component.scss']
})
export class ScriptsListComponent implements OnInit {

  @Input() scripts: Script[] | null = [];
  @Output() scriptSelected = new EventEmitter<Script>();
  @Output() scriptRemoved = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  selectScript(script: any) {
    this.scriptSelected.emit(script);
  }

  removeScript(id: any) {
    this.scriptRemoved.emit(id);
  }

}
