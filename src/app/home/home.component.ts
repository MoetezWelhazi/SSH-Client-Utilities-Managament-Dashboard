import { Component, OnInit } from '@angular/core';
import {UserInfo} from "../shared/interfaces/auth.interface";
import {TokenStorageService} from "../shared/services/auth/token-storage.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private tokenStorage : TokenStorageService) {
  }

  hide = true;

  userInfo = this.tokenStorage.getUser();

  notifications = [
    {
      id: 1,
      title: 'Welcome!',
      description: 'Congratulations for being approved!',
      status: "important",
    },
    {
      id: 2,
      title: 'Permission Granted!',
      description: 'You now have access to all scripts!',
      status: "new",
    },
    {
      id: 3,
      title: 'Execution Failed!',
      description: 'Your scheduled execution has failed!',
      status: "old",
    }
  ];


  ngOnInit(): void {
  }
  ngAfterViewInit() {
    document.body.classList.add('home-background');
  }

  ngOnDestroy() {
    document.body.classList.remove('home-background');
  }

  deleteNotification(id: number) {
    console.log("Notification N°"+id+" has been deleted");
  }
}
