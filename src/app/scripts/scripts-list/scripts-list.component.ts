import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Script} from "../../shared/interfaces/script.interface";

@Component({
  selector: 'app-scripts-list',
  templateUrl: './scripts-list.component.html',
  styleUrls: ['./scripts-list.component.css']
})
export class ScriptsListComponent implements OnInit {

  @Input() scripts: Script[] | null = [];
  @Output() scriptSelected = new EventEmitter<Script>();
  @Output() scriptDeleted = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  selectScript(script: any) {
    this.scriptSelected.emit(script);
  }

  deleteScript(id: any) {
    this.scriptDeleted.emit(id);
  }

}
