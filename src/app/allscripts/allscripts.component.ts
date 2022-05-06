import {Component, OnInit, ViewChild} from '@angular/core';
import {Table} from "primeng/table";
import {UserInfo} from "../shared/models/auth.interface";
import {ScriptsService} from "../shared/services/scripts/scripts.service";
import {NotificationService} from "../shared/services/notifications/notification.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {Script} from "../shared/models/script.interface";
import {Upload} from "../shared/models/upload.interface";
import {AddscriptformComponent} from "./addscriptform/addscriptform.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {TokenStorageService} from "../shared/services/auth/token-storage.service";
import {ShareScriptsComponent} from "../allscripts/share-scripts/share-scripts.component";
import {finalize} from "rxjs";
import {ScriptShare} from "../shared/models/share.interface";
import {PreviewScriptComponent} from "./preview-script/preview-script.component";

@Component({
  selector: 'app-allscripts',
  templateUrl: './allscripts.component.html',
  styleUrls: ['./allscripts.component.scss']
})
export class AllscriptsComponent implements OnInit {

  statuses: any[] = [];

  tableOptions = [
    {label: 'Add script', icon: 'pi pi-fw pi-user-plus', command: () => { this.add(); } },
    {label: 'Share Scripts', icon: 'pi pi-fw pi-user-plus', command: () => { this.sharedWith(); } },
    ];

  loading: boolean = true;

  @ViewChild('dt') table: Table | undefined;

  scripts: Script[] =[{name:"",description:""}];

  selectedScripts? : Script[];

  constructor(private scriptsService: ScriptsService ,
              private notificationService:NotificationService,
              private tokenStorageService: TokenStorageService,
              public confirmationService:ConfirmationService ,
              public messageService: MessageService ,
              public dialog: MatDialog,
              ) { }

  ngOnInit(): void {
    this.selectedScripts = [{name:"",description:""}]
    this.getScripts()
    this.statuses = [
      {label: 'Public', value: 'Public'},
      {label: 'Private', value: 'Private'},
      {label: 'Unassigned', value: 'null'}
    ]
    if(this.isAdmin())
    this.tableOptions =  [
      {label: 'Add script', icon: 'pi pi-fw pi-plus', command: () => { this.add(); } },
      {label: 'Share Scripts', icon: 'pi pi-fw pi-user-plus', command: () => { this.sharedWith(); } },
      {label: 'Delete Scripts', icon: 'pi pi-fw pi-trash', command: () => { this.deleteAll(); } },
      {label: 'Make Scripts Editable', icon: 'pi pi-fw pi-lock-open', command: () => { this.editableAll(); } },
      {label: 'Make Scripts Uneditable', icon: 'pi pi-fw pi-lock', command: () => { this.uneditableAll(); } },
    ]
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }

  onDateSelect(value : any) {
    // @ts-ignore
    this.table.filter(this.formatDate(value), 'date', 'equals')
  }

  formatDate(date : any) {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
    return date.getFullYear() + '-' + month + '-' + day;
  }

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onRowSelect() {
    console.log(this.selectedScripts)
  }

  getEditable(editable: any) {
    if(editable=='1')
      return true;
    if(editable=='0')
      return false;
    return false;
  }

  private delete(id: number, confirm:boolean) {
    if (!confirm)
      this.scriptsService.deleteScript(id)
        .subscribe({
          next: (data)=>{
            this.messageService.add({severity:'success', summary:'Script Deleted', detail:data.message})
            this.scripts = this.scripts.filter((script)=> {
              return script.id !== id
            });
          },
          error: (err)=> {
            this.messageService.add({severity:'error', summary:'Error',detail:err.error.message})
          }
        })
    else
      this.confirmationService.confirm({
        key:'confirmDialog',
        header: 'Delete Confirmation',
        message: 'Script n°'+id+' will be deleted. Are you sure that you want to perform this action?',
        accept: () => {
          this.scriptsService.deleteScript(id)
            .subscribe({
              next: (data)=>{
                this.messageService.add({severity:'success', summary:'Script Deleted', detail:data.message})
                this.scripts = this.scripts.filter((script)=> {
                  return script.id !== id
                });
              },
              error: (err)=> {
                this.messageService.add({severity:'error', summary:'Error',detail:err.error.message})
              }
            });
        },
      });
  }

  private updateMeta(script: Script, field: string){
    let updatedScript = {...script};
    switch (field) {
      case "uneditable":
        updatedScript.editable = false;
        updatedScript.update = "uneditable";
        break;
      case "editable":
        updatedScript.editable = true
        updatedScript.update = "editable";
        break;
      case "public":
        updatedScript.type = field;
        updatedScript.editable = this.getEditable(script.editable)
        updatedScript.update = "public";
        break;
      case "private":
        updatedScript.type = field;
        updatedScript.editable = this.getEditable(updatedScript.editable)
        updatedScript.update = "private";
        break;
    }
    //console.log("SCRIPT TO UPDATE: "+JSON.stringify(updatedScript))
    this.scriptsService.updateScript(updatedScript)
      .subscribe({
        next: (data)=>{
          this.messageService.add({severity:'success', summary:'Script Updated', detail:data.message})
          this.getScripts()
        },
        error: (err)=>{
          this.messageService.add({severity:'error', summary:'Error',detail:err.error.message})
        }
      })

  }

  getItems(Script: any) {
    if(this.isAdmin())
      return [
      {label: 'Make Public', icon: 'pi pi-eye', command: () => {
          this.updateMeta(Script,"public");
        }
      },
      {label: 'Make Private', icon: 'pi pi-eye-slash', command: () => {
          this.updateMeta(Script,"private");
        }
      },
      {label: 'Delete', icon: 'pi pi-fw pi-trash', command: () => {
          this.delete(Script.id,true);
        }
      },
      {label: 'Make Editable', icon: 'pi pi-lock-open', command: () => {
          this.updateMeta(Script,"editable");
        }
      },
      {label: 'Make Uneditable', icon: 'pi pi-lock', command: () => {
          this.updateMeta(Script,"uneditable");
        }
      },
      {label: 'Preview Script', icon: 'pi pi-search', command: () => {
          this.previewScript(Script);}
      },
      {label: 'Add to my scripts', icon: 'pi pi-fw pi-user-plus', command: () => {
        //@ts-ignore
          this.addToUser(Script.id,{uid:this.tokenStorageService.getUser().id,share:true},true);
        }
      },
    ];
    else return [{label: 'Add to my scripts', icon: 'pi pi-fw pi-user-plus', command: () => {
        //@ts-ignore
        this.addToUser(Script.id, {uid:this.tokenStorageService.getUser().id,share:true},true);
      }
    }]
  }

  private add() {
    const user = this.tokenStorageService.getUser();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = "material-popup"
    dialogConfig.data = { id: user.id };
    let dialogRef = this.dialog.open(AddscriptformComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((upload : Upload) => {
      if (upload) {
        this.scriptsService.createScript(upload)
          .subscribe({
            next: (result)=>{
              this.messageService.add({severity:'success', summary:'Script Added', detail:"Script added successfully!"})
              this.getScripts()
            },
            error: (err)=>{
              this.messageService.add({severity:'error', summary:'Error',detail:err.error.message})
            }
          })
      }
    });
  }

  private addToUser(sId: any, share:ScriptShare, notify:boolean) {
    //console.log("SCRIPT SHARE (addToUser): "+JSON.stringify(share))
    this.scriptsService.shareScript(sId,share)
      .subscribe({
        next:(data)=>{
          if(notify)
          this.messageService.add({severity:'success', summary:'Script Shared', detail:"Script shared successfully!"})
        },
        error: (err)=>{
          this.messageService.add({severity:'error', summary:'Error',detail:err.error.message})
        }
      })
  }

  isAdmin():boolean{
    // @ts-ignore
    return this.tokenStorageService.getUser().roles.includes("ROLE_ADMIN")
  }

  private sharedWith() {
    if(this.isAdmin()) {
      // @ts-ignore
      if (this.selectedScripts.length > 1) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.panelClass = "material-popup"
        dialogConfig.autoFocus = true;
        dialogConfig.data = {scripts: this.selectedScripts};
        let dialogRef = this.dialog.open(ShareScriptsComponent, dialogConfig);
        dialogRef.afterClosed().pipe(finalize(()=>{
              this.messageService.add({severity:'info', summary:'Scripts Shared', detail:"Scripts shared!"})
          }))
          .subscribe(result => {
            if(result.share){
              result.users.map((user: UserInfo) => {
                if (user.id) {
                  //console.log("USER TO SHARE TO:"+user.id)
                  this.selectedScripts?.map(script => {
                    if (script.id)
                      this.addToUser(script.id, {uid: user.id, share: true}, false);
                  })
                }
              })
            }
            else {
              result.users.map((user: UserInfo) => {
                if (user.id) {
                  //console.log("USER TO SHARE TO:"+user.id)
                  this.selectedScripts?.map(script => {
                    if (script.id)
                      this.addToUser(script.id, {uid: user.id, share: false}, false);
                  })
                }
              })
            }
        })
      } else this.messageService.add({severity: 'warn', summary: 'Error', detail: "No Scripts selected to share!"})
    }
    else{
      //@ts-ignore
      if (this.selectedScripts.length > 1) {
        //@ts-ignore
        let id = this.tokenStorageService.getUser().id
        this.selectedScripts?.map(script =>{
          if(script.id)
          this.addToUser(script.id,{uid: this.tokenStorageService.getUser().id, share: false},true)

        })
      } else this.messageService.add({severity: 'warn', summary: 'Error', detail: "No Scripts selected to share!"})

    }
  }

  private deleteAll() {
    this.confirmationService.confirm({
      key:'confirmDialog',
      header: 'Delete Confirmation',
      // @ts-ignore
      message: (this.selectedScripts?.length)+' scripts will be deleted. Are you sure that you want to perform this action?',
      accept: () => {
        this.selectedScripts?.forEach((script)=>{
          if (script.id != null) {
            this.delete(script.id,false);
          }
        });
      },
    });
  }

  private editableAll() {
    this.confirmationService.confirm({
      key:'confirmDialog',
      header: 'Script Update Confirmation',
      // @ts-ignore
      message: (this.selectedScripts?.length -1 )+' users will be granted edit privilege of the script. Are you sure that you want to perform this action?',
      accept: () => {
        this.selectedScripts?.forEach((script)=>{
          if((script.editable==0||script.editable==null)&&(script.id!=null))
          {
            this.updateMeta(script,"editable");
          }
        })
      },
    });
  }
  private uneditableAll() {
    this.confirmationService.confirm({
      key:'confirmDialog',
      header: 'Script Update Confirmation',
      // @ts-ignore
      message: (this.selectedScripts?.length -1 )+' scripts will be made uneditable by regular users. Are you sure that you want to perform this action?',
      accept: () => {
        this.selectedScripts?.forEach((script)=>{
          if((script.editable==1||script.editable==0)&&(script.id!=null))
          {
            this.updateMeta(script,"null");
          }
        })
      },
    })
  }

  private getScripts() {
    this.scriptsService.getAllScripts(false)
      .subscribe({
        next: (data: any[]) => {
          data.forEach((script)=>{
            let newScript : Script = script;
            switch(script.editable){
              case null:
                newScript.editable = "null";
                break;
              case true:
                newScript.editable = "1";
                break;
              case false:
                newScript.editable = "0";
            };
            // @ts-ignore
            newScript.createdAt = new Date(script.createdAt)
            if(newScript.author==null)
              newScript.author = "Deleted"
          });
          this.loading = false;
          console.log(data);
          this.scripts = data;
        },
        error: (e: { error: string; }) => this.notificationService.warn("An error has occurred: "+e.error)
      });
  }

  getAuthorTrigram(author: any) {
    if(author!=undefined) {
      //console.log(JSON.stringify(author))
      if(author.trigramme==undefined)
        return author
      return author.trigramme
    }
    else {
      //console.log(JSON.stringify(author))
      return author
    }
  }

  private previewScript(Script: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = "material-popup"
    dialogConfig.autoFocus = true;
    dialogConfig.data = {currentScript: Script}
    let dialogRef = this.dialog.open(PreviewScriptComponent, dialogConfig);
  }
}
