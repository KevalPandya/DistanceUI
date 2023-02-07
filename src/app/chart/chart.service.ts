import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Province } from '../model/province';
import { Site } from '../model/site';
import { Driver } from '../model/driver';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  private baseAddress = environment.APIBaseAddress;
  private distanceUrl = '/api/distance';

  constructor(private http: HttpClient) { }

  getDistanceByProvince(): Observable<Province[]> {
    return this.http.get<Province[]>(this.baseAddress + this.distanceUrl + '/by-province')
      .pipe(
        tap(_ => this.log('fetched distance by province')),
        catchError(this.handleError<Province[]>('getDistanceByProvince', []))
      );
  }

  getDistanceBySite(provinceId: number): Observable<Site[]> {
    return this.http.get<Site[]>(this.baseAddress + this.distanceUrl + '/by-site/' + provinceId)
      .pipe(
        tap(_ => this.log('fetched distance by site')),
        catchError(this.handleError<Site[]>('getDistanceBySite', []))
      );
  }

  getDistanceByDriver(siteId: number): Observable<Driver[]> {
    return this.http.get<Driver[]>(this.baseAddress + this.distanceUrl + '/by-driver/' + siteId)
      .pipe(
        tap(_ => this.log('fetched distance by driver')),
        catchError(this.handleError<Driver[]>('getDistanceByDriver', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`ChartService: ${message}`)
  }
}