import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import {MsalModule, MsalInterceptor} from '@azure/msal-angular';

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
    MsalModule.forRoot({
      auth: {
        clientId: environment.authInfo.clientId,
        authority: environment.authInfo.authority,
        validateAuthority: false,
        navigateToLoginRequestUrl: false,
        redirectUri: window.location.origin
      },
      framework: {
        protectedResourceMap: environment.authInfo.protectedResourceMap
      }
    },
    {
      popUp: false,
      consentScopes: environment.authInfo.consentScopes,
      extraQueryParameters: {}
    }),
  ],
  providers: [
    HttpInterceptorProvider,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
