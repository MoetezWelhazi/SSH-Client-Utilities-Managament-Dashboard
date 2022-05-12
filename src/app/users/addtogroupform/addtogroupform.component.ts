import {Component, Inject, OnInit} from '@angular/core';
import {GroupInterface} from "../../shared/models/group.interface";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Script} from "../../shared/models/script.interface";
import {UsersService} from "../../shared/services/users/users.service";
import {NotificationService} from "../../shared/services/notifications/notification.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {GroupsService} from "../../shared/services/groups/groups.service";

@Component({
  selector: 'app-addtogroupform',
  templateUrl: './addtogroupform.component.html',
  styleUrls: ['./addtogroupform.component.css']
})
export class AddtogroupformComponent implements OnInit {

  selectedGroups? : GroupInterface[];

  groups: GroupInterface[] =[{name:"",members:[]}];

  loading:boolean = true

  constructor(@Inject(MAT_DIALOG_DATA) public data: {users: any[]},
              public dialogRef: MatDialogRef<AddtogroupformComponent>,
              private groupsService: GroupsService ,
              private notificationService:NotificationService,
              public confirmationService:ConfirmationService ,
              public messageService: MessageService ,) { }

  ngOnInit(): void {
    this.getGroups()

  }

  private getGroups() {
    this.groupsService.getAllGroups(false)
      .subscribe({
        next: (data) => {
          this.loading = false;

          console.log(data);
          this.groups = data;
        },
        error: (e) => this.notificationService.warn("Error: "+e.error)
      });
  }

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  getSize(group: any) {
    return group.members.length
  }

  add() {
    let result = {groups : this.selectedGroups}
    this.dialogRef.close(result);
  }
}
