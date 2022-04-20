import { Component, OnInit } from '@angular/core';
import {Script} from "../../shared/models/script.interface";
import {Upload} from "../../shared/models/upload.interface";

@Component({
  selector: 'app-addscriptform',
  templateUrl: './addscriptform.component.html',
  styleUrls: ['./addscriptform.component.css']
})
export class AddscriptformComponent implements OnInit {
  fileName : string= ""
  script : Script ={
    name:"",
    description:""
  }
  upload: Upload = {
    script:this.script,
    id:0,

  }
  private : boolean = false
  fileSelected : boolean = false

  constructor() { }

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
    console.log("Script: "+this.script)
    console.log("Upload: "+this.upload)
  }
}
