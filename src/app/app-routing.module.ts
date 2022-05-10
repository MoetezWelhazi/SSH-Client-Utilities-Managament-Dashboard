import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { AuthGuard } from "./shared/guards/auth.guard";
import { AuthenticateComponent } from "./authenticate/authenticate.component";
import { UsersComponent } from "./users/users.component";
import { ServersComponent } from './servers/servers.component';
import { MyScriptsComponent } from "./myscripts/my-scripts.component";
import { AllscriptsComponent } from "./allscripts/allscripts.component";
import {AdminGuard} from "./shared/guards/admin.guard";
import { HistoryComponent } from './history/history.component';
import {GroupsComponent} from "./groups/groups.component";

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'auth', component: AuthenticateComponent },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard,AdminGuard] },
  { path: 'servers' , component : ServersComponent , canActivate : [AuthGuard,AdminGuard] },
  { path: 'myscripts' , component : MyScriptsComponent, canActivate: [AuthGuard] },
  { path: 'allscripts' , component : AllscriptsComponent, canActivate: [AuthGuard] },
  { path: 'history' , component : HistoryComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'groups', component : GroupsComponent, canActivate: [AuthGuard, AdminGuard]},
  { path: '**', component: AppComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
