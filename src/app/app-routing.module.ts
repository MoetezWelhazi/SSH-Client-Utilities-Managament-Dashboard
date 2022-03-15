import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { AuthGuard } from "./shared/guards/auth.guard";
import { AuthenticateComponent } from "./authenticate/authenticate.component";

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'auth', component: AuthenticateComponent },
  { path: '**', component: AppComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
