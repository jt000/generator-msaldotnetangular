import { Component, OnInit } from '@angular/core';
import { MsalService, BroadcastService } from '@azure/msal-angular';
import { Account, AuthError, AuthResponse } from 'msal';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  title = '<%= webclientname %>';
  currentAccount: Account;

  constructor(private msalService: MsalService, private broadcastService: BroadcastService) {
  }

  ngOnInit(): void {
    this.currentAccount = this.msalService.getAccount();

    this.msalService.handleRedirectCallback(this.onHandleCallback);

    this.broadcastService.subscribe('msal:loginFailure', () => {
      this.msalService.loginRedirect();
    });
  }

  onHandleCallback(redirectError: AuthError, redirectResponse: AuthResponse) {
    if (redirectError) {
      console.error('Redirect error: ', redirectError);
      return;
    }

    console.log('Redirect success: ', redirectResponse);
  }
}
