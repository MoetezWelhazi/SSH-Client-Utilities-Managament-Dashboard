import { Component, OnInit } from '@angular/core';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserInfo } from 'src/app/shared/models/auth.interface';
import { NotificationService } from 'src/app/shared/services/notifications/notification.service';
import { UsersService } from 'src/app/shared/services/users/users.service';

@Component({
  selector: 'app-remove-owner',
  templateUrl: './remove-owner.component.html',
  styleUrls: ['./remove-owner.component.css']
})
export class RemoveOwnerComponent implements OnInit {
  userlist :UserInfo[] = []
  constructor(private usersService: UsersService,private notificationService:NotificationService,public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.getUsers();
  }

  removeOwner(user: UserInfo) {
    this.ref.close(user);
  }

 
  

  private getUsers() {
    let id = localStorage.getItem("ServerId")
    this.usersService.getOwnersOfServer(+id!)
      .subscribe({
        next: (data) => {
          this.userlist = data;
          console.log("list of owners");
          console.log(data);
        },
        error: (e) => this.notificationService.warn("An error has occurred: "+e.error)
      });
  }

}
