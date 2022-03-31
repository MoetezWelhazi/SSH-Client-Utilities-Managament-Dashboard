import {Component, OnInit, ViewChild} from '@angular/core';
import { UserInfo } from "../shared/interfaces/auth.interface";
import { Table } from "primeng/table";
import { NotificationService } from "../shared/services/notifications/notification.service";
import { DialogService } from "primeng/dynamicdialog";
import { AdduserformComponent } from "./adduserform/adduserform.component";
import {ConfirmationService, MessageService} from "primeng/api";
import {UsersService} from "../shared/services/users/users.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {

  statuses = [
    {label: 'Approved', value: 1},
    {label: 'Waiting Approval', value: 0},
    {label: 'Refused', value: null}
  ];

  tableOptions = [
    {label: 'Add user', icon: 'pi pi-fw pi-user-plus', command: () => {
        this.add();
      }
      },
    {label: 'Delete Selected', icon: 'pi pi-fw pi-trash', command: () => {
        this.deleteAll();
      }
      },
    {label: 'Approve Selected', icon: 'pi pi-fw pi-users', command: () => {
        this.approveAll();
      }
    },
    {label: 'Refuse Selected', icon: 'pi pi-fw pi-times', command: () => {
        this.refuseAll();
      }
    },];

  loading: boolean = true;

  @ViewChild('dt') table: Table | undefined;

  users: UserInfo[] =[{email:""}];

  selectedUsers? : UserInfo[];

  constructor(private usersService: UsersService ,
              private notificationService:NotificationService,
              public confirmationService:ConfirmationService ,
              public messageService: MessageService ,
              public dialogService: DialogService) { }

  ngOnInit(): void {
    this.selectedUsers = [{email:""}]
    this.getUsers()
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
    console.log(this.selectedUsers)
  }

  getStatus(status: any) {
    if(status==null)
      return "Refused";
    if(status==1)
      return "Approved";
    return "Waiting";
  }

  private update(user:UserInfo) {
    this.notificationService.success("action updated for user: "+user+" !");
  }

  private delete(id: number) {
    this.usersService.deleteUser(id)
      .subscribe({
        next: (data)=>{
          this.messageService.add({severity:'success', summary:'User Deleted', detail:data.message})
          this.users = this.users.filter((user)=> {
            return user.id !== id
          });
        },
        error: (err)=> {
          this.messageService.add({severity:'error', summary:'Error',detail:err.error.message})
        }
      })
  }

  private approve(user: UserInfo) {
    user.approved = "approved"
    user.roles = [this.getRoles(user.roles)]
    this.usersService.updateUser(user)
      .subscribe({
        next: (data)=>{
          this.messageService.add({severity:'success', summary:'User Updated', detail:data.message})
          user.approved = 1;
        },
        error: (err)=>{
          this.messageService.add({severity:'error', summary:'Error',detail:err.error.message})
        }
      })
  }

  private refuse(user: UserInfo) {
    user.approved = "null"
    user.roles = [this.getRoles(user.roles)]
    this.usersService.updateUser(user)
      .subscribe({
        next: (data)=>{
          this.messageService.add({severity:'success', summary:'User Updated', detail:data.message})
          user.approved = null;
        },
        error: (err)=>{
          this.messageService.add({severity:'error', summary:'Error',detail:err.error.message})
        }
      })
  }

  getItems(User: any) {
    return [
      {label: 'Update', icon: 'pi pi-refresh', command: () => {
          this.update(User);
        }
      },
      {label: 'Delete', icon: 'pi pi-fw pi-user-minus', command: () => {
          this.delete(User.id);
        }
      },
      {label: 'Approve', icon: 'pi pi-check', command: () => {
          this.approve(User);
        }
      },
      {label: 'Refuse', icon: 'pi pi-times', command: () => {
          this.refuse(User);
        }
      },
    ];
  }

  private add() {
    const ref = this.dialogService.open(AdduserformComponent, {
      header: 'Add User',
      width: '50%'
    });
    ref.onClose.subscribe((userInfo : UserInfo) => {
      if (userInfo) {
        this.usersService.createUser(userInfo)
          .subscribe({
            next: (data)=>{
              this.messageService.add({severity:'success', summary:'User Added', detail:data.message})
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
        message: this.selectedUsers?.length+' users will be deleted. Are you sure that you want to perform this action?',
        accept: () => {
          this.selectedUsers?.forEach((user)=>{
            if (user.id != null) {
              this.delete(user.id);
            }
          });
        },
      });
  }

  private approveAll() {
    this.confirmationService.confirm({
      key:'confirmDialog',
      header: 'Delete Confirmation',
      // @ts-ignore
      message: (this.selectedUsers?.length -1 )+' users will be granted access to the app. Are you sure that you want to perform this action?',
      accept: () => {
        this.selectedUsers?.forEach((user)=>{
          if((user.approved==0||user.approved==null)&&(user.id!=null))
          {
            this.approve(user);
          }
        })
      },
    });
  }
  private refuseAll() {
    this.confirmationService.confirm({
      key:'confirmDialog',
      header: 'Delete Confirmation',
      // @ts-ignore
      message: (this.selectedUsers?.length -1 )+' users will be refused access to the app. Are you sure that you want to perform this action?',
      accept: () => {
        this.selectedUsers?.forEach((user)=>{
          if((user.approved==1||user.approved==0)&&(user.id!=null))
          {
            this.refuse(user);
          }
        })
      },
    })
  }

  getRoles(role: any) {
    if(role=="ROLE_USER")
      return "user";
    return "admin";
  }

  private getUsers() {
    this.usersService.getAllUsers(false)
      .subscribe({
        next: (data) => {
          data.forEach((user)=>{
            let newUser : UserInfo = user;
            // @ts-ignore
            newUser.roles = user.roles[0].name;
            switch(user.approved){
              case null:
                newUser.approved = null;
                break;
              case true:
                newUser.approved = 1;
                break;
              case false:
                newUser.approved = 0;
            }
          });
          this.loading = false;
          console.log(data);
          this.users = data;
        },
        error: (e) => this.notificationService.warn("An error has occurred: "+e.error)
      });
  }
}
