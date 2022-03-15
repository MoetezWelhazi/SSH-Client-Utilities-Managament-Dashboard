import { Component, EventEmitter, Output } from '@angular/core';
import { UserInfo } from "../../shared/interfaces/auth.interface";
import {FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";

@Component({
  selector: 'app-signupform',
  templateUrl: './signupform.component.html',
  styleUrls: ['./signupform.component.scss']
})


export class SignupformComponent {

  hide = true;
  userInfo: UserInfo = {
    email: '',
    password: '',
    trigram: '',
    isAdmin:false,
};
  @Output() signup = new EventEmitter();
  @Output() toSignin = new EventEmitter();



}
