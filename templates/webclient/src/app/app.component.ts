import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { EventMessage, EventType } from '@azure/msal-browser';
import { AccountInfo } from '@azure/msal-common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = '<%= webclientname %>';
  isLoaded = false;
  copyrightYear = new Date().getFullYear();

  constructor(private msalService: MsalService) {
  }

  ngOnInit(): void {
    const msalInstance = this.msalService.instance;

    // Account selection logic is app dependent. Adjust as needed for different use cases.
    // Set active acccount on page load
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      msalInstance.setActiveAccount(accounts[0]);
    }

    msalInstance.addEventCallback((event: EventMessage) => {
      // set active account after redirect

      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
        const payload = event.payload as any;
        const account = payload.account as AccountInfo;
        msalInstance.setActiveAccount(account);
        console.log(EventType.LOGIN_SUCCESS, account);
      } else if (event.eventType === EventType.LOGIN_FAILURE) {
        console.log(EventType.LOGIN_FAILURE, event);
      }
    });

    // handle auth redired/do all initial setup for msal
    msalInstance.handleRedirectPromise().then(() => {
      // Check if user signed in
      const account = msalInstance.getActiveAccount();
      if(!account){
        // redirect anonymous user to login page
        msalInstance.loginRedirect();
      } else {
        console.log('login successful', msalInstance.getActiveAccount());
        this.isLoaded = true;
      }
    }).catch(err=>{
      // TODO: Handle errors
      console.log('handleRedirectPromise failed', err);
    });
  }
}
