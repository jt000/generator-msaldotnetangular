import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { MsalModule, MsalInterceptor } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from "@azure/msal-browser";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { AuthRootComponent } from './auth-root/auth-root.component';
import { HomeComponent } from './home/home.component';

import {ApiModule} from '../webapiclient';

const HttpInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: MsalInterceptor,
  multi: true,
};


@NgModule({
  declarations: [
    AppComponent,
    AuthRootComponent,
    HomeComponent
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
    }),
    {
      interactionType: InteractionType.Redirect,
      authRequest: {
        scopes: environment.authInfo.consentScopes,
        extraQueryParameters: {}
      },
    },
    {
      interactionType: InteractionType.Redirect,
      protectedResourceMap: environment.authInfo.protectedResourceMap
    }),
  ],
  providers: [
    HttpInterceptorProvider,
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
