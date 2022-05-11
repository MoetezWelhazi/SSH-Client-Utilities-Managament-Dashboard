import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { UserInfo } from "../shared/models/auth.interface";
import { Table } from "primeng/table";
import { NotificationService } from "../shared/services/notifications/notification.service";
import { DialogService } from "primeng/dynamicdialog";
import {ConfirmationService, MessageService} from "primeng/api";
import {UsersService} from "../shared/services/users/users.service";
import { AddServerFormComponent } from './add-server-form/add-server-form.component';
import { ServerInfo } from '../shared/models/server.interface';
import { ServersService } from '../shared/services/servers/servers.service';
import { AddOwnerComponent } from './add-owner/add-owner.component';
import { RemoveOwnerComponent } from './remove-owner/remove-owner.component';
import { TokenStorageService } from '../shared/services/auth/token-storage.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.scss']
})
export class ServersComponent implements OnInit {

  statuses: any[] = [];

  tableOptionsAdmin = [
    {label: 'Add Server', icon: 'pi pi-align-justify', command: () => { this.add(); } },
    {label: 'Import Servers', icon: 'pi pi-upload', command: () => { this.import(); } },
    {label: 'Export Servers', icon: 'pi pi-fw pi-download', command: () => {this.export();  } },
    {label: 'Delete Selected', icon: 'pi pi-fw pi-trash', command: () => {this.deleteAll();  } },
  ];

  tableOptionsUser = [
    {label: 'Add Server', icon: 'pi pi-align-justify', command: () => { this.add(); } },
    {label: 'Import Servers', icon: 'pi pi-upload', command: () => { this.import(); } },
    {label: 'Export Servers', icon: 'pi pi-download', command: () => {this.export();  } },
  ];


  loading: boolean = true;

  @ViewChild('dt') table: Table | undefined;



  servers: any =[];

  selectedServers? : ServerInfo[]=[];

  constructor(private usersService: UsersService ,
              private notificationService:NotificationService,
              public confirmationService:ConfirmationService ,
              private tokenStorageService: TokenStorageService,
              public messageService: MessageService ,
              private serversService : ServersService,
              public dialogService: DialogService,
              ) { }

  ngOnInit(): void {
    this.selectedServers = []
    this.getServers()

  }


  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onRowSelect($event: any) {
    console.log(this.selectedServers)
  }


  private add() {
    const ref = this.dialogService.open(AddServerFormComponent, {
      header: 'Add Server',
      width: '50%'
    });
    ref.onClose.subscribe((serverInfo : ServerInfo) => {
      if (serverInfo) {
        this.serversService.createServer(serverInfo)
          .subscribe({
            next: (data)=>{
              this.messageService.add({severity:'success', summary:'Server Added', detail:data.message})
              this.getServers()
            },
            error: (err)=>{
              this.messageService.add({severity:'error', summary:'Error',detail:err.error.message})
            }
          })
      }
    });
  }
  parseFile(event:any){

    let fileReader = new FileReader();
    fileReader.onload = (e) => {
    let data = fileReader.result as string;
    data.replace("\t" , "");
    let lines = data.split("\n")
    lines.forEach(line =>{
      let info = line.split(':');
      let newServer = new ServerInfo();
      newServer.login = info[0]
      newServer.name = info[1]
      newServer.password = info[2]
      newServer.description = info[3]
      newServer.type =  info[4]
      this.serversService.createServer(newServer)
          .subscribe({
            next: (data)=>{
              this.messageService.add({severity:'success', summary:'Server Added', detail:data.message})
              this.getServers()
            },
            error: (err)=>{
              this.messageService.add({severity:'error', summary:'Error',detail:err.error.message})
            }
          })

    });
    }
    fileReader.readAsText(event.target.files[0]);
  }

  private import(){
    (<HTMLInputElement>document.getElementById("file")).click()
    
      }
  private deleteAll() {
    if(this.selectedServers){
      this.confirmationService.confirm({
        key:'confirmDialog',
        header: 'Delete Confirmation',
        message: this.selectedServers?.length+' servers will be deleted. Are you sure that you want to perform this action?',
        accept: () => {
         for(let server of this.selectedServers! ){
              this.serversService.deleteServer(server.id!).subscribe({
                next: (data)=>{
                  this.messageService.add({severity:'success', summary:'Server Deleted', detail:data.message})
                  this.getServers()
                },
                error: (err)=>{
                  this.messageService.add({severity:'error', summary:'Error',detail:err.error.message})
                }
              })   
          };
        }
      })
    }
  }

      
 
  
  export() {
this.serversService.exportExcel().subscribe(blob => saveAs(blob, "ServerList.xlsx"))
  }
  getMenuPublic(server : ServerInfo) 
  {
   return [
      {label: 'Make Private', icon: 'pi pi-align-justify', command: () => { this.makePrivate(server); } },
  
      {label: 'Delete Selected', icon: 'pi pi-fw pi-trash', command: () => {this.delete(server.id!);  } },
    ];
  }

  isAdmin():boolean{
    // @ts-ignore
    return this.tokenStorageService.getUser().roles.includes("ROLE_ADMIN")
  }

  getMenuPrivate(server : ServerInfo) 
  {
   return [
    {label: 'Make Public', icon: 'pi pi-align-justify', command: () => { this.makePublic(server); } },
    {label: 'Add Owner', icon: 'pi pi-align-justify', command: () => { this.addOwner(server); } },
    {label: 'Remove Owner', icon: 'pi pi-align-justify', command: () => { this.removeOwner(server); } },
    {label: 'Delete Selected', icon: 'pi pi-fw pi-trash', command: () => {this.delete(server.id!);  } },
  ];
  }

  getServers() {
    this.serversService.getServerPerUser().subscribe({
      next:data =>
    {
      this.servers = data;
      this.loading = false
      console.log(this.servers);
    },
      error: err =>{
        this.messageService.add({severity:"error",summary:"Error",detail:err.message})
      }
  })
  }

  delete(id: number) {

    this.confirmationService.confirm({
      key:'confirmDialog',
      header: 'Delete Confirmation',
      message: 'Server will be deleted. Are you sure that you want to perform this action?',
      accept: () => {
        this.serversService.deleteServer(id)
          .subscribe({
            next: (data)=>{
              this.messageService.add({severity:'success', summary:'User Deleted', detail:data.message})
       
            },
            error: (err)=> {
              this.messageService.add({severity:'error', summary:'Error',detail:err.error.message})
            }
          });
      },
    });
  }



  makePrivate(server: ServerInfo) {

    this.serversService.makePrivate(server.id!).subscribe({
      next:data =>
    {

      this.getServers();
    },
      error: err =>{
        this.messageService.add({severity:"error",summary:"Error",detail:err.message})
      }
  })
  }

  makePublic(server: ServerInfo) {
    this.serversService.makePublic(server.id!).subscribe({
      next:data =>
    {
      this.getServers();
    },
      error: err =>{
        this.messageService.add({severity:"error",summary:"Error",detail:err.message})
      }
  })
  }

  private addOwner(server: ServerInfo) {
    localStorage.setItem("ServerId",server.id!+"");
    const ref2 = this.dialogService.open(AddOwnerComponent, {
      header: 'Add Owner',
      width: '50%'
    });
    ref2.onClose.subscribe((selectedUsers : UserInfo[]) => {
      for(let user of selectedUsers) {
        this.serversService.addOwner(server.id!,user.id!)
          .subscribe({
            next: (data)=>{
              this.messageService.add({severity:'success', summary:'Owner Added', detail:data.message})
              this.getServers()
            },
            error: (err)=>{
              this.messageService.add({severity:'error', summary:'Error',detail:err.error.message})
            }
          })
      }
    });
  }

  private removeOwner(server: ServerInfo) {
    localStorage.setItem("ServerId",server.id!+"");
    const ref3 = this.dialogService.open(RemoveOwnerComponent, {
      header: 'Remove Owner',
      width: '50%'
    });
    ref3.onClose.subscribe((selectedUsers : UserInfo[]) => {
      for(let user of selectedUsers) {
        this.serversService.removeOwner(server.id!,user.id!)
          .subscribe({
            next: (data)=>{
              this.messageService.add({severity:'success', summary:'Owner removed', detail:data.message})
              this.getServers()
            },
            error: (err)=>{
              this.messageService.add({severity:'error', summary:'Error',detail:err.error.message})
            }
          })
      }
    });
  }

}



