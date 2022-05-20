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
import { PrimengModule } from './primeng.module';
import { UsersComponent } from './users/users.component';
import { AdduserformComponent } from './users/adduserform/adduserform.component';
import { AuthInterceptor } from "./shared/services/interceptors/http-interceptor.service";
import { ServersComponent } from './servers/servers.component';
import { MyScriptsComponent } from './myscripts/my-scripts.component';
import { ScriptsListComponent } from './myscripts/scripts-list/scripts-list.component';
import { ScriptDetailsComponent } from './myscripts/script-details/script-details.component';
import { ExecuteScriptComponent } from './myscripts/execute-script/execute-script.component';
import { NgTerminalModule } from 'ng-terminal';
import { RxStompService } from "./shared/services/websocket/rxstomp.service";
import { rxStompServiceFactory } from "./shared/services/websocket/rxStompServiceFactory";
import { AllscriptsComponent } from './allscripts/allscripts.component';
import { AddscriptformComponent } from './allscripts/addscriptform/addscriptform.component';
import { ShareScriptsComponent } from './allscripts/share-scripts/share-scripts.component';
import { DragDropFileUploadDirective } from './shared/directives/drag-drop-file-uploads.directive';
import { AddServerFormComponent } from './servers/add-server-form/add-server-form.component';
import { HistoryComponent } from './history/history.component';
import { ExecutionDetailsComponent } from './history/execution-details/execution-details.component';
import { PreviewScriptComponent } from './allscripts/preview-script/preview-script.component';
import { MatCardModule } from '@angular/material/card';
import { AddOwnerComponent } from './servers/add-owner/add-owner.component';
import { RemoveOwnerComponent } from './servers/remove-owner/remove-owner.component';
import { AddgroupformComponent } from './users/addgroupform/addgroupform.component';
import { AddtogroupformComponent } from './users/addtogroupform/addtogroupform.component';
import { ProfileComponent } from './profile/profile.component';
import { GroupsComponent } from './groups/groups.component';
import { MembersComponent } from './groups/members/members.component';


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
    PrimengModule,
    NgTerminalModule,
    MatCardModule


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
    UsersComponent,
    ServersComponent,
    AddServerFormComponent,
    AdduserformComponent,
    AddOwnerComponent,
    RemoveOwnerComponent,
    MyScriptsComponent,
    ScriptsListComponent,
    ScriptDetailsComponent,
    ExecuteScriptComponent,
    AllscriptsComponent,
    AddscriptformComponent,
    ShareScriptsComponent,
    DragDropFileUploadDirective,
    HistoryComponent,
    ExecutionDetailsComponent,
    PreviewScriptComponent,
    AddgroupformComponent,
    AddtogroupformComponent,
    ProfileComponent,
    GroupsComponent,
    MembersComponent,
  ],
  providers: [
    AuthService,
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
    },
    NotificationService,
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    },
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: BsDropdownConfig, useValue: { autoClose: true } },
    { provide: BsDropdownDirective },

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
