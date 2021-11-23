import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { MsalModule, MsalInterceptor, MsalRedirectComponent } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { AuthRootComponent } from './auth-root/auth-root.component';
import { HomeComponent } from './home/home.component';

import { ApiModule } from '../webapiclient';
import { LoginFailedComponent } from './login-failed/login-failed.component';
import { AmtNavbarComponent } from './amt-navbar/amt-navbar.component';

const HTTP_INTERCEPTOR_PROVIDER = {
  provide: HTTP_INTERCEPTORS,
  useClass: MsalInterceptor,
  multi: true,
};

@NgModule({
  declarations: [
    AppComponent,
    AuthRootComponent,
    HomeComponent,
    LoginFailedComponent,
    AmtNavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ApiModule,
    MsalModule.forRoot(new PublicClientApplication({
      auth: {
        clientId: environment.authInfo.clientId,
        authority: environment.authInfo.authority,
        navigateToLoginRequestUrl: false,
        redirectUri: window.location.origin
      },
      cache: {
        cacheLocation: 'sessionStorage'
      }
    }),
    {
      interactionType: InteractionType.Redirect,
      authRequest: {
        scopes: environment.authInfo.consentScopes
      },
      loginFailedRoute: '/login-failed'
    },
    {
      interactionType: InteractionType.Redirect,
      protectedResourceMap: environment.authInfo.protectedResourceMap
    }),
  ],
  providers: [
    HTTP_INTERCEPTOR_PROVIDER,
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})

export class AppModule { }
