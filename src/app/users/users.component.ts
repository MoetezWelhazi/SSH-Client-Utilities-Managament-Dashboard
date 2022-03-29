import {Component, OnInit, ViewChild} from '@angular/core';
import {UserInfo} from "../shared/interfaces/auth.interface";
import {Table} from "primeng/table";

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
  ]

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

  selectedUsers? : UserInfo[];

  constructor() { }

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
}
