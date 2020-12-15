import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { PingService, Configuration } from '../../webapiclient';
import { environment } from 'src/environments/environment';

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
        catchError((e: HttpErrorResponse, caught) => { this.pingStatus = `error: ${e.message}`; return caught; })
      ).subscribe((r: HttpResponse<void>) => { this.pingStatus = `response: ${r.statusText}`; });


    this.adminStatus = 'pending';
    this.pingSvc.apiPingAdminGet()
      .pipe(
        catchError((e: HttpErrorResponse, caught) => { this.adminStatus = `error: ${e.message}`; return caught; })
      ).subscribe((r: HttpResponse<void>) => { this.adminStatus = `response: ${r.statusText}`; });
  }

}
