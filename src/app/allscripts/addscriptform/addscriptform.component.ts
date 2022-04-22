import {Component, Inject, OnInit} from '@angular/core';
import {Script} from "../../shared/models/script.interface";
import {Upload} from "../../shared/models/upload.interface";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-addscriptform',
  templateUrl: './addscriptform.component.html',
  styleUrls: ['./addscriptform.component.scss']
})
export class AddscriptformComponent implements OnInit {
  fileName : string= ""
  script : Script ={
    name:"",
    description:"",
    type:false,
    editable:false
  }
  upload: Upload = {
    script:this.script,
    id:0,

  }
  fileSelected : boolean = false

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {id:any},
    public dialogRef: MatDialogRef<AddscriptformComponent>,
  ) {
    this.upload.id=data.id;
  }

  ngOnInit(): void {
  }

  onFileSelect($event: Event) {
    // @ts-ignore
    const file:File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      this.script.name = this.fileName;
      this.upload.file=file
      //formData.append("thumbnail", file);
    }
  }

  addScript() {
    this.script.type = this.script.type? "Private":"Public"
    this.dialogRef.close(this.upload)
    console.log("Script: "+JSON.stringify(this.script))
    console.log("Upload: "+JSON.stringify(this.upload))

  }
}
