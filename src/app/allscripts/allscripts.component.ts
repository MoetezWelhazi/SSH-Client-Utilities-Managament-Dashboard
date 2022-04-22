import {Component, OnInit, ViewChild} from '@angular/core';
import {Table} from "primeng/table";
import {UserInfo} from "../shared/models/auth.interface";
import {ScriptsService} from "../shared/services/scripts/scripts.service";
import {NotificationService} from "../shared/services/notifications/notification.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {DialogService} from "primeng/dynamicdialog";
import {AdduserformComponent} from "../users/adduserform/adduserform.component";
import {Script} from "../shared/models/script.interface";
import {Upload} from "../shared/models/upload.interface";
import {AddscriptformComponent} from "./addscriptform/addscriptform.component";

@Component({
  selector: 'app-allscripts',
  templateUrl: './allscripts.component.html',
  styleUrls: ['./allscripts.component.scss']
})
export class AllscriptsComponent implements OnInit {

  statuses: any[] = [];

  tableOptions = [
    {label: 'Add script', icon: 'pi pi-fw pi-user-plus', command: () => { this.add(); } },
    {label: 'Shared with', icon: 'pi pi-fw pi-user-plus', command: () => { this.sharedWith(); } },
    {label: 'Delete Selected', icon: 'pi pi-fw pi-trash', command: () => { this.deleteAll(); } },
    {label: 'Make Scripts Editable', icon: 'pi pi-fw pi-users', command: () => { this.editableAll(); } },
    {label: 'Make Scripts Uneditable', icon: 'pi pi-fw pi-times', command: () => { this.uneditableAll(); } },
  ];

  loading: boolean = true;

  @ViewChild('dt') table: Table | undefined;

  scripts: Script[] =[{name:"",description:""}];

  selectedScripts? : Script[];

  constructor(private scriptsService: ScriptsService ,
              private notificationService:NotificationService,
              public confirmationService:ConfirmationService ,
              public messageService: MessageService ,
              public dialogService: DialogService) { }

  ngOnInit(): void {
    this.selectedScripts = [{name:"",description:""}]
    this.getScripts()
    this.statuses = [
      {label: 'Public', value: '1'},
      {label: 'Private', value: '0'},
      {label: 'Unassigned', value: 'null'}
    ]
  }

  ngAfterViewInit() {
    document.body.classList.add('users-background');
  }

  ngOnDestroy() {
    document.body.classList.remove('users-background');
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
      return "Editable";
    if(editable=='0')
      return "Uneditable";
    return "Unassigned";
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

  private update(script: Script, field: string){
    switch (field) {
      case "uneditable":
        script.editable = false;
        break;
      case "editable":
        script.editable = true
        break;
      case "public":
        script.status = field;
        break;
      case "private":
        script.status = field;
        break;
    }
    this.scriptsService.updateScript(script)
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
    return [
      {label: 'Make Public', icon: 'pi pi-user-edit', command: () => {
          this.update(Script,"public");
        }
      },
      {label: 'Make Private', icon: 'pi pi-user-edit', command: () => {
          this.update(Script,"private");
        }
      },
      {label: 'Delete', icon: 'pi pi-fw pi-user-minus', command: () => {
          this.delete(Script.id,true);
        }
      },
      {label: 'Make Editable', icon: 'pi pi-check', command: () => {
          this.update(Script,"editable");
        }
      },
      {label: 'Make Uneditable', icon: 'pi pi-times', command: () => {
          this.update(Script,"uneditable");
        }
      },
      {label: 'Add to my scripts', icon: 'pi pi-fw pi-user-plus', command: () => {
        //@ts-ignore
          this.addToUser(Script.id,JSON.parse(window.sessionStorage.getItem("auth-user")).id);
        }
      },
    ];
  }

  private add() {
    const ref = this.dialogService.open(AddscriptformComponent, {
      header: 'Add Script',
      width: '50%'
    });
    ref.onClose.subscribe((upload : Upload) => {
      if (upload) {
        this.scriptsService.createScript(upload)
          .subscribe({
            next: (data)=>{
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

  private addToUser(sId: any, uId:any) {
    this.scriptsService.shareScript(sId,uId)
      .subscribe({
        next:(data)=>{
          this.messageService.add({severity:'success', summary:'Script Shared', detail:"Script shared successfully!"})
        },
        error: (err)=>{
          this.messageService.add({severity:'error', summary:'Error',detail:err.error.message})
        }
      })
  }

  private sharedWith() {

  }

  private deleteAll() {
    this.confirmationService.confirm({
      key:'confirmDialog',
      header: 'Delete Confirmation',
      // @ts-ignore
      message: (this.selectedScripts?.length-1)+' scripts will be deleted. Are you sure that you want to perform this action?',
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
            this.update(script,"editable");
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
            this.update(script,"null");
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
            newScript.createdAt = new Date(user.createdAt)
          });
          this.loading = false;
          //console.log(data);
          this.scripts = data;
        },
        error: (e: { error: string; }) => this.notificationService.warn("An error has occurred: "+e.error)
      });
  }
}
