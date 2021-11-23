import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { AuthRootComponent } from './auth-root/auth-root.component';
import { HomeComponent } from './home/home.component';
import { LoginFailedComponent } from './login-failed/login-failed.component';

const routes: Routes = [
  {
    path: '',
    component: AuthRootComponent,
    children: [
      {
        path: '',
        canActivate: [MsalGuard],
        component: HomeComponent
      }
    ]
  },
  {
    path: 'login-failed',
    component: LoginFailedComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
