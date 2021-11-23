import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { catchError, retryWhen, delay, concatMap } from 'rxjs/operators';
import { PingService, Configuration } from '../../webapiclient';
import { environment } from 'src/environments/environment';
import { EMPTY, throwError } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public environment = environment.name;
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
        retryWhen(e => e.pipe(
          delay(3000),
          concatMap((v, i) => i === 2 ? throwError(v) : [v])
        )),
        catchError((e: HttpErrorResponse) => { this.pingStatus = `error: ${e.message}`; return EMPTY; })
      ).subscribe(() => { this.pingStatus = 'OK'; });


    this.adminStatus = 'pending';
    this.pingSvc.apiPingAdminGet()
      .pipe(
        retryWhen(e => e.pipe(
          delay(3000),
          concatMap((v, i) => i === 2 ? throwError(v) : [v])
        )),
        catchError((e: HttpErrorResponse) => { this.adminStatus = `error: ${e.message}`; return EMPTY; })
      ).subscribe(() => { this.adminStatus = 'OK'; });
  }

}
