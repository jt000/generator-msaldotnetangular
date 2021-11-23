import { Component, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';

@Component({
  selector: 'amt-navbar',
  templateUrl: './amt-navbar.component.html',
  styleUrls: ['./amt-navbar.component.scss']
})
export class AmtNavbarComponent implements OnInit {

  public loggedInUser = '';

  constructor(private msalService: MsalService, private broadcastService: MsalBroadcastService) { }

  ngOnInit(): void {
    let account = this.msalService.instance.getActiveAccount();
    this.loggedInUser = account?.username || '';

    this.broadcastService.msalSubject$.subscribe(() => {
      account = this.msalService.instance.getActiveAccount();
      this.loggedInUser = account?.username || '';
    });
  }

  signOut(): void {
    const account = this.msalService.instance.getActiveAccount();
    this.msalService.instance.logoutRedirect({
      account
    });
  }
}
