import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Table} from "primeng/table";
import {UserInfo} from "../../shared/models/auth.interface";
import {ConfirmationService, MessageService} from "primeng/api";
import {GroupsService} from "../../shared/services/groups/groups.service";
import {NotificationService} from "../../shared/services/notifications/notification.service";

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  loading: boolean = true;
  users: UserInfo[] = [{email: ""}];
  selectedUsers?: UserInfo[];
  statuses: any[] = [];

  @ViewChild('dt') table: Table | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {gid:any,name:any},
              public confirmationService: ConfirmationService,
              private notificationService: NotificationService,
              public messageService: MessageService,
              public groupsService: GroupsService,
              public dialogRef: MatDialogRef<MembersComponent>,) { }

  ngOnInit(): void {
    this.selectedUsers = [{email: ""}]
    this.getMembers()
    this.statuses = [
      {label: 'Approved', value: '1'},
      {label: 'Waiting', value: '0'},
      {label: 'Refused', value: 'null'}
    ]
  }

  tableOptions = [
    {
      label: 'Remove Members', icon: 'pi pi-fw pi-user-plus', command: () => {
        this.removeMembers(true);
      }
    },
  ];

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  getRoles(role: any) {
    if (role == "ROLE_USER")
      return "user";
    return "admin";
  }

  getStatus(status: any) {
    if (status == 'null')
      return "Refused";
    if (status == '1')
      return "Approved";
    return "Waiting";
  }

  private removeFromGroup(member:any,notify:boolean){
    this.groupsService.removeFromGroup(member.gid,member.id).subscribe(
      {
        next:(data)=>{
          if(notify)
            this.messageService.add({severity:'success', summary:'Group Updated', detail: "User n°"+member.id+" removed successfully from Group n°"+member.gid})
        },
        error:(err)=>{
          this.messageService.add({severity:'error', summary:'Error',detail:"Something went wrong with removing User n°"+member.id+" from Group n°"+member.gid+":\n"+err.error.message})
        }
      }
    )
  }

  private removeMembers(notify:boolean) {
    if(notify)
      this.confirmationService.confirm({
        key:'confirmDialog',
        header: 'Delete Confirmation',
        message: this.selectedUsers?.length+' user(s) will be removed from group n°'+this.data.gid+'. Are you sure that you want to perform this action?',
        accept: () => {
          this.selectedUsers?.forEach((member:any)=>{
            this.removeFromGroup(member,true)
          })
        },
      });
    else this.selectedUsers?.forEach((member:any)=>{
      this.removeFromGroup(member,false)
    })
    this.getMembers()
  }

  private getMembers() {
    this.groupsService.getGroup(this.data.gid).subscribe({
      next: (data) => {
        data.forEach((user) => {
          let newUser: UserInfo = user;
          // @ts-ignore
          newUser.roles = user.roles[0].name;
          switch (user.approved) {
            case null:
              newUser.approved = "null";
              break;
            case true:
              newUser.approved = "1";
              break;
            case false:
              newUser.approved = "0";
          }
          // @ts-ignore
          newUser.createdAt = new Date(user.createdAt)
          let groups: any[] = []
          if(user.groups?.length == 0)
            groups = ["Not Assigned"]
          else user.groups?.forEach((group:any)=>{
            if(group.name)
              groups.push(group.name)
            else groups.push(group)
          })
          newUser.groups = groups
        });
        this.loading = false;
        //console.log(data);
        this.users = data;
      },
      error: (e) => this.notificationService.warn("An error has occurred: " + e.error)
    });
  }
}
