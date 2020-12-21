import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { PingService, Configuration } from '../../webapiclient';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public pingStatus = '';
  public adminStatus = '';
  private pingSvc: PingService;

  constructor(private $httpClient: HttpClient) {
    this.pingSvc = new PingService(this.$httpClient, environment.webApi.url, new Configuration({withCredentials: false}));
  }

  async ngOnInit(): Promise<void> {

    this.pingStatus = 'pending';
    this.pingSvc.apiPingGet()
      .pipe(
        catchError((e: HttpErrorResponse, caught) =>
        {
          return of(`error: ${e.message}`);
        })
      ).subscribe((r: string) => {
        this.pingStatus = r || 'success';
      });

    this.adminStatus = 'pending';
    this.pingSvc.apiPingAdminGet()
      .pipe(
        catchError((e: HttpErrorResponse, caught) => 
        { 
          return of(`error: ${e.message}`);
        })
      ).subscribe((r: string) => { 
        this.adminStatus = r || 'success'; 
      });
  }
}
