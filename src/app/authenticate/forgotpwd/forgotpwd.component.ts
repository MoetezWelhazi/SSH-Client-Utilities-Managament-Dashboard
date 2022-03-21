import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { passwordMatchValidator } from "../../shared/directives/password-confirm.validator";
import { Validators, FormBuilder, FormGroup, FormControl } from "@angular/forms";
import {UserInfo} from "../../shared/interfaces/auth.interface";

@Component({
  selector: 'app-forgotpwd',
  templateUrl: './forgotpwd.component.html',
  styleUrls: ['./forgotpwd.component.scss']
})
export class ForgotpwdComponent{

  @Output() toMain = new EventEmitter();
  @Output() updatePwd = new EventEmitter();

  minPw = 8;

  userInfo: UserInfo = {
    email: '',
    password: '',
    trigram: '',
    isAdmin:false,
  };

  firstFormGroup : FormGroup = new FormGroup({firstCtrl: new FormControl('', [Validators.required,Validators.pattern("(^[a-zA-Z0-9é]+(\\.)[a-zA-Z0-9]+@neoxam\\.com)?")]),});

  secondFormGroup : FormGroup = new FormGroup({secondCtrl: new FormControl('', [Validators.required,]),});

  thirdFormGroup: FormGroup = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(this.minPw)]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    //@ts-ignore
    passwordMatchValidator.mustMatch('password','confirmPassword')
    );
  get d() {
    return this.firstFormGroup.controls;
  }
  get e() {
    return this.secondFormGroup.controls;
  }
  get f() {
    return this.thirdFormGroup.controls;
  }

}
