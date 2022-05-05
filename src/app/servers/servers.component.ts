import {Component, OnInit, ViewChild} from '@angular/core';
import { UserInfo } from "../shared/models/auth.interface";
import { Table } from "primeng/table";
import { NotificationService } from "../shared/services/notifications/notification.service";
import { DialogService } from "primeng/dynamicdialog";
import {ConfirmationService, MessageService} from "primeng/api";
import {UsersService} from "../shared/services/users/users.service";
import { AddServerFormComponent } from './add-server-form/add-server-form.component';
import { ServerInfo } from '../shared/models/server.interface';
import { ServersService } from '../shared/services/servers/servers.service';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.scss']
})
export class ServersComponent implements OnInit {

  statuses: any[] = [];

  tableOptions = [
    {label: 'Add Server', icon: 'pi pi-align-justify', command: () => { this.add(); } },
    {label: 'Import Servers', icon: 'pi pi-upload', command: () => { this.import(); } },
    {label: 'Delete Selected', icon: 'pi pi-fw pi-trash', command: () => { this.deleteAll(); } },
  ];

  loading: boolean = true;

  @ViewChild('dt') table: Table | undefined;



  servers: any;

  selectedServers? : UserInfo[];

  constructor(private usersService: UsersService ,
              private notificationService:NotificationService,
              public confirmationService:ConfirmationService ,
              public messageService: MessageService ,
              private serversService : ServersService,
              public dialogService: DialogService) { }

  ngOnInit(): void {
    this.selectedServers = [{email:""}]
    this.getUsers()
    this.statuses = [
      {label: 'public', value: '0'},
      {label: 'private', value: '1'},

    ]
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
              this.getUsers()
            },
            error: (err)=>{
              this.messageService.add({severity:'error', summary:'Error',detail:err.error.message})
            }
          })

    });
    }
    fileReader.readAsText(event.target.files[0]);
  }

  ngAfterViewInit() {
  }

  private import(){
(<HTMLInputElement>document.getElementById("file")).click()

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
    console.log(this.selectedServers)
  }



  private delete(id: number) {
    this.serversService.deleteServer(id)
      .subscribe({
        next: (data)=>{
          this.messageService.add({severity:'success', summary:'Server Deleted', detail:data.message})
          this.servers = this.servers!.filter((user: { id: number; })=> {
            return user.id !== id
          });
        },
        error: (err)=> {
          this.messageService.add({severity:'error', summary:'Error',detail:err.error.message})
        }
      })
  }

  private update(user: UserInfo, field: string){
    switch (field) {
      case "null":
        user.approved = field;
        user.roles = [this.getRoles(user.roles)];
        break;
      case "approved":
        user.approved = field
        user.roles = [this.getRoles(user.roles)];
        break;
      case "admin":
        user.approved = "approved"
        user.roles = [field];
        break;
    }
    this.usersService.updateUser(user)
      .subscribe({
        next: (data)=>{
          this.messageService.add({severity:'success', summary:'User Updated', detail:data.message})
          this.getUsers()
        },
        error: (err)=>{
          this.messageService.add({severity:'error', summary:'Error',detail:err.error.message})
        }
      })

  }

  getItems(Server: any) {
    return [
      {label: 'Make private', icon: 'pi pi-user-edit', command: () => {
          this.update(Server,"private");
        }
      },


      {label: 'Approve', icon: 'pi pi-check', command: () => {
          this.update(Server,"public");
        }
      },
    ];
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
              this.getUsers()
            },
            error: (err)=>{
              this.messageService.add({severity:'error', summary:'Error',detail:err.error.message})
            }
          })
      }
    });
  }

  private deleteAll() {
      this.confirmationService.confirm({
        key:'confirmDialog',
        header: 'Delete Confirmation',
        message: this.selectedServers?.length+' servers will be deleted. Are you sure that you want to perform this action?',
        accept: () => {
          this.selectedServers?.forEach((user)=>{
            if (user.id != null) {
              this.delete(user.id);
            }
          });
        },
      });
  }



  getRoles(role: any) {
    if(role=="ROLE_USER")
      return "user";
    return "admin";
  }

  private getUsers() {
    this.serversService.getAllServers(false)
      .subscribe({
        next: (data) => {
          data.forEach((server)=>{
            let newServer : ServerInfo = server;
            // @ts-ignore

            // @ts-ignore

          });
          this.loading = false;
          //console.log(data);
          this.servers = data;
        },
        error: (e) => this.notificationService.warn("An error has occurred: "+e.error)
      });
  }

}



