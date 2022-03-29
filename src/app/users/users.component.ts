import {Component, OnInit, ViewChild} from '@angular/core';
import {UserInfo} from "../shared/interfaces/auth.interface";
import {Table} from "primeng/table";
import {NotificationService} from "../shared/services/notifications/notification.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
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

  loading: boolean = false;

  @ViewChild('dt') table: Table | undefined;

  users : UserInfo[]= [
    {
      email:"welhazi.moetez@gmail.com",
      trigramme:"MWE",
      roles: ["ROLE_ADMIN"],
      joinDate: new Date(),
      status: 1
    },
    {
      email:"welhazi.moetez1@gmail.com",
      trigramme:"MEE",
      roles: ["ROLE_USER"],
      joinDate: new Date(),
      status: 0
    },
    {
      email:"welhazi.moetez2@gmail.com",
      trigramme:"EEE",
      roles: ["ROLE_USER"],
      joinDate: new Date(),
      status: null
    },
    {
      email:"welhazi.moetez3@gmail.com",
      trigramme:"MWW",
      roles: ["ROLE_USER"],
      joinDate: new Date(),
      status: null
    },
    {
      email:"welhazi.moetez4@gmail.com",
      trigramme:"WWW",
      roles: ["ROLE_USER"],
      joinDate: new Date(),
      status: 0
    },
  ];

  selectedUsers? : UserInfo[] = [];

  constructor(private notificationService:NotificationService) { }

  ngOnInit(): void {
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

  onRowSelect($event: any) {
    console.log(this.selectedUsers)
  }

  getStatus(status: any) {
    if(status==null)
      return "Refused";
    if(status==1)
      return "Approved";
    return "Waiting";
  }

  update(email:string) {
    this.notificationService.success("action updated for user: "+email+" !");
  }

  delete(email: string) {
    this.notificationService.warn("action deleted!");
  }

  approve(email: string) {
    this.notificationService.success("user "+email+" has been approved!");
  }

  getItems(User: any) {
    return [
      {label: 'Update', icon: 'pi pi-refresh', command: () => {
          this.update(User.email);
        }
      },
      {label: 'Delete', icon: 'pi pi-fw pi-user-minus', command: () => {
          this.delete(User.email);
        }
      },
      {label: 'Approve', icon: 'pi pi-check', command: () => {
          this.approve(User.email);
        }
      },
      {label: 'Refuse', icon: 'pi pi-times', command: () => {
          this.refuse(User.email);
        }
      },
    ];
  }

  private add() {
    this.notificationService.success("User Added")
  }

  private refuse(email: string) {
    this.notificationService.warn("User "+ email +" has been refused access to the application !")
  }

  private deleteAll() {
    let cpt = 0;
    // @ts-ignore
    this.selectedUsers.forEach((user)=>{
      console.log(JSON.stringify(user) + " has been deleted!");
      cpt++;
    })
    this.notificationService.success(cpt+" users have been approved!");
  }

  private approveAll() {
    let cpt = 0;
    // @ts-ignore
    this.selectedUsers.forEach((user)=>{
      if(user.status==0)
      {
        console.log(JSON.stringify(user) + " has been approved!");
        cpt++;
      }
    })
    this.notificationService.success(cpt+" users have been approved!");
  }
  private refuseAll() {
    let cpt = 0;
    // @ts-ignore
    this.selectedUsers.forEach((user)=>{
      if(user.status==0)
      {
        console.log(JSON.stringify(user) + " has been refused!");
        cpt++;
      }
    })
    this.notificationService.warn(cpt+" users have been refused!");
  }


}
