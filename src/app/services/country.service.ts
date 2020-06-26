import { Info } from './../models/info';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private readonly API = 'https://api.covid19api.com/country/'

  constructor(
    private http: HttpClient,
  ) { }

  public getCountry(country: string) {
    return this.http.get<Info[]>(`${this.API}/${country}/status/deaths`)
      .pipe(
        tap(console.log)
      )
      
  }
}
