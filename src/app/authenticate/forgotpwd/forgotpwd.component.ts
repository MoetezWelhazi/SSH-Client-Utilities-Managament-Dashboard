import { Component, EventEmitter, Output } from '@angular/core';
import { passwordMatchValidator } from "../../shared/directives/password-confirm.validator";
import { Validators, FormGroup, FormControl } from "@angular/forms";
import {AuthService} from "../../shared/services/auth/auth.service";
import {NotificationService} from "../../shared/services/notifications/notification.service";

@Component({
  selector: 'app-forgotpwd',
  templateUrl: './forgotpwd.component.html',
  styleUrls: ['./forgotpwd.component.scss']
})
export class ForgotpwdComponent{
  constructor(private authService: AuthService,
              private notificationService: NotificationService,) {}

  @Output() toMain = new EventEmitter();

  minPw = 8;
  completed1 = true;
  completed2 = true;
  password = "";
  email = "";
  token = "";

  firstFormGroup : FormGroup = new FormGroup({firstCtrl: new FormControl('', [Validators.required,Validators.pattern("(^[a-zA-Z0-9é]+(\\.)[a-zA-Z0-9]+@(neoxam|gmail)\\.com)?")]),});

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

  sendEmail(email: any){
    this.authService.sendEmail(email).subscribe(
      data => {
        this.notificationService.notify(data.message);
        this.completed1 = false;
      },
      err => {
        this.notificationService.notify(err.error.message)
        this.completed1 = true;
      }
    );
  }

  verifyCode(email: any, token:any) {
    this.authService.verifyCode(email, token).subscribe(data => {
        this.notificationService.notify(data.message);
        this.completed2 = false;
      },
      err => {
        this.notificationService.notify(err.error.message)
        this.completed2 = true;
      })
  }

  updatePwd(email:any, password:any) {
    this.authService.updatePwd(email, password).subscribe(data => {
        this.notificationService.notify(data.message);
      },
      err => {
        this.notificationService.notify(err.error.message)
      })
  }
}
