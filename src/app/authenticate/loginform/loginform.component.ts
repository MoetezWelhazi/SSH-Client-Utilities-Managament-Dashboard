import {Component, EventEmitter, Input, OnInit, Output, Renderer2} from '@angular/core';
import {UserInfo} from "../../shared/interfaces/auth.interface";

@Component({
  selector: 'app-loginform',
  templateUrl: './loginform.component.html',
  styleUrls: ['./loginform.component.scss']
})
export class LoginformComponent{

  userInfo: UserInfo = {
    email: '',
    password: '',
  };

  @Output() login = new EventEmitter();
  @Output() toSignup = new EventEmitter();
}
