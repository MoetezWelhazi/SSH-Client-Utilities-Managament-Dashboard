import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Script} from "../../shared/models/script.interface";
import * as ace from "ace-builds";

@Component({
  selector: 'app-preview-script',
  templateUrl: './preview-script.component.html',
  styleUrls: ['./preview-script.component.scss']
})
export class PreviewScriptComponent implements OnInit,AfterViewInit {

  //@ts-ignore
  @ViewChild("editor") private editor: ElementRef<HTMLElement>;

  aceEditor: any ;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {currentScript: Script},
              public dialogRef: MatDialogRef<PreviewScriptComponent>,) { }

  ngOnInit(): void {
    ace.config.set("fontSize", "14px");
    ace.config.set(
      "basePath",
      "https://unpkg.com/ace-builds@1.4.14/src-noconflict"
    );
  }

  ngAfterViewInit() {
    this.aceEditor = ace.edit(this.editor.nativeElement);
    //ace-builds@1.4.14
    this.aceEditor.setTheme('ace/theme/eclipse');
    this.aceEditor.session.setNewLineMode("unix");
    this.aceEditor.session.setMode('ace/mode/sh');
    this.aceEditor.setReadOnly(true)
    this.aceEditor.session.setValue(this.data.currentScript.code);
  }

}
