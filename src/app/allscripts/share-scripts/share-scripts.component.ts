import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Table} from "primeng/table";
import {UserInfo} from "../../shared/models/auth.interface";
import {UsersService} from "../../shared/services/users/users.service";
import {NotificationService} from "../../shared/services/notifications/notification.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {DialogService} from "primeng/dynamicdialog";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Script} from "../../shared/models/script.interface";

@Component({
  selector: 'app-share-scripts',
  templateUrl: './share-scripts.component.html',
  styleUrls: ['./share-scripts.component.scss']
})
export class ShareScriptsComponent implements OnInit {

  loading: boolean = true;

  @ViewChild('dt') table: Table | undefined;

  statuses: any[] = [];

  users: UserInfo[] =[{email:""}];

  selectedUsers? : UserInfo[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {scripts: Script[]},
    public dialogRef: MatDialogRef<ShareScriptsComponent>,
    private usersService: UsersService ,
    private notificationService:NotificationService,
    public confirmationService:ConfirmationService ,
    public messageService: MessageService ,
  ) { }

  ngOnInit(): void {
    this.selectedUsers = [{email:""}]
    this.getUsers()
    this.statuses = [
      {label: 'Approved', value: '1'},
      {label: 'Waiting', value: '0'},
      {label: 'Refused', value: 'null'}
    ]
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
    //console.log(this.selectedUsers)
  }

  getStatus(status: any) {
    if(status=='null')
      return "Refused";
    if(status=='1')
      return "Approved";
    return "Waiting";
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
                newUser.approved = "null";
                break;
              case true:
                newUser.approved = "1";
                break;
              case false:
                newUser.approved = "0";
            };
            // @ts-ignore
            newUser.createdAt = new Date(user.createdAt)
          });
          this.loading = false;
          //console.log(data);
          this.users = data;
        },
        error: (e) => this.notificationService.warn("An error has occurred: "+e.error)
      });
  }

  getScriptNames() {
    let str = "";
    this.data.scripts.map(script=>{
      //console.log("SCRIPT: "+script.name)
      str = str + script.name +", "
    })
    str = str.slice(2,str.length-2)
    //console.log("TITLE: "+str);
    return str
  }

  share() {
    this.dialogRef.close(this.selectedUsers);
  }
}
