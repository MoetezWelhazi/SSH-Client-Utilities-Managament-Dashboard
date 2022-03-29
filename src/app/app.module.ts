import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeComponent } from './home/home.component';
import { MaterialModule } from './material.module';
import { AuthService } from './shared/services/auth/auth.service';
import { NotificationService } from './shared/services/notifications/notification.service';

import { LoginformComponent } from './authenticate/loginform/loginform.component';
import { BsDropdownConfig, BsDropdownDirective, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AuthenticateComponent } from "./authenticate/authenticate.component";
import { SignupformComponent } from './authenticate/signupform/signupform.component';
import { CheckPasswordDirective } from "./shared/directives/check-password.directive";
import { ForgotpwdComponent } from './authenticate/forgotpwd/forgotpwd.component';
import { MatStepperModule } from "@angular/material/stepper";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { LoaderComponent } from './shared/components/loader/loader.component';
import { LoaderService } from "./shared/services/loader/loader.service";
import { LoaderInterceptor } from "./shared/services/interceptors/loader-interceptor.service";
import { ChartModule } from "primeng/chart";
import { SharedModule } from "primeng/api";
import { PrimengModule } from './primeng.module';
import { UsersComponent } from './users/users.component';



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
    MatStepperModule,
    ChartModule,
    SharedModule,
    PrimengModule,
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    AuthenticateComponent,
    LoginformComponent,
    SignupformComponent,
    CheckPasswordDirective,
    ForgotpwdComponent,
    LoaderComponent,
    UsersComponent
  ],
  providers: [
    AuthService,
    NotificationService,
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    },
    LoaderService,{ provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: BsDropdownConfig, useValue: { autoClose: true } },
    { provide: BsDropdownDirective }

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
