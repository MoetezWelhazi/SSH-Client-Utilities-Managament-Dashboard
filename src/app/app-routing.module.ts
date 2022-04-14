import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { AuthGuard } from "./shared/guards/auth.guard";
import { AuthenticateComponent } from "./authenticate/authenticate.component";
import { UsersComponent } from "./users/users.component";
import { ServersComponent } from './servers/servers.component';
import { ScriptsComponent } from "./scripts/scripts.component";

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'auth', component: AuthenticateComponent },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'servers' , component : ServersComponent , canActivate : [AuthGuard] },
  { path: 'scripts' , component : ScriptsComponent, canActivate: [AuthGuard] },
  { path: '**', component: AppComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
