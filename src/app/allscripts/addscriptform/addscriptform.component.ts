import {Component, Inject, OnInit} from '@angular/core';
import {Script} from "../../shared/models/script.interface";
import {Upload} from "../../shared/models/upload.interface";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MessageService} from "primeng/api";

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
    public messageService: MessageService ,
  ) {
    this.upload.id=data.id;
  }

  ngOnInit(): void {
  }

  onFileSelect(files: any) {
    //console.log(files)
    let file:File | undefined
    if(files instanceof FileList)
      file = files[0]
    // @ts-ignore
     else file= files.target.files[0];
    if (file) {
      //console.log("FILE TYPE: "+file.type)
      if(file.type!="text/x-sh")
        this.messageService.add({severity:'error', summary:'Error',detail:"File is not a Shell script"})
      else {
        this.fileName = file.name;
        this.script.name = this.fileName;
        this.upload.file = file
      }
    }
  }

  addScript() {
    this.script.type = this.script.type? "Private":"Public"
    this.dialogRef.close(this.upload)
    console.log("Script: "+JSON.stringify(this.script))
    console.log("Upload: "+JSON.stringify(this.upload))

  }
}
