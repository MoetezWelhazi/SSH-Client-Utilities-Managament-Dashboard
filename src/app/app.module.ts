import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeComponent } from './home/home.component';
import { MaterialModule } from './material.module';
import { AuthService } from './shared/services/auth/auth.service';
import { NotificationService } from './shared/services/notifications/notification.service';

import { LoginformComponent } from './authenticate/loginform/loginform.component';

import { BsDropdownModule} from 'ngx-bootstrap/dropdown';
import { AuthenticateComponent } from "./authenticate/authenticate.component";
import { SignupformComponent } from './authenticate/signupform/signupform.component';
import { CheckPasswordDirective } from "./shared/directives/check-password.directive";
import { ForgotpwdComponent } from './authenticate/forgotpwd/forgotpwd.component';
import {MatStepperModule} from "@angular/material/stepper";
import {STEPPER_GLOBAL_OPTIONS} from "@angular/cdk/stepper";

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    BsDropdownModule,
    MatStepperModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    AuthenticateComponent,
    LoginformComponent,
    SignupformComponent,
    CheckPasswordDirective,
    ForgotpwdComponent
  ],
  providers: [
    AuthService,
    NotificationService,
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
      }
    ],
  bootstrap: [AppComponent],
})
export class AppModule {}
