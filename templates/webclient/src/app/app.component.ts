import { Component, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-common';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  title = '<%= webclientname %>';
  currentAccount: AccountInfo | null;

  constructor(private msalService: MsalService, private broadcastService: MsalBroadcastService) {
  }

  ngOnInit(): void {
    this.currentAccount = this.msalService.instance.getActiveAccount();

    this.msalService.instance.handleRedirectPromise()
      .then(r => console.log('Redirect success: ', r?.account))
      .catch(err => console.error('Redirect error: ', err));

    this.broadcastService.inProgress$.subscribe(() => {}, () => {
      this.msalService.loginRedirect();
    });
  }
}
