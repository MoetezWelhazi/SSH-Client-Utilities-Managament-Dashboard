import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserInfo } from 'src/app/shared/models/auth.interface';
import { NotificationService } from 'src/app/shared/services/notifications/notification.service';
import { UsersService } from 'src/app/shared/services/users/users.service';

@Component({
  selector: 'app-add-owner',
  templateUrl: './add-owner.component.html',
  styleUrls: ['./add-owner.component.css']
})
export class AddOwnerComponent implements OnInit {
  
  hide = false;
  selectedValue:any;
  userlist :UserInfo[] = []
  message:any

  constructor(private usersService: UsersService,private notificationService:NotificationService,public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit(): void {
    this.getUsers();
  }

  addOwner(user: UserInfo) {
    this.ref.close(user);
  }

 
  

  private getUsers() {
    let id = localStorage.getItem("ServerId")
    this.usersService.getNotOwnersOfServer(+id!)
      .subscribe({
        next: (data) => {
          this.userlist = data;
          console.log(data);
        },
        error: (e) => this.notificationService.warn("An error has occurred: "+e.error)
      });
  }

}
