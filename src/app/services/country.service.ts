import { CovidCases } from './../models/cases';

import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private readonly API = 'https://api.covid19api.com/country'

  constructor(
    private http: HttpClient,
  ) { }

  public getCasesOfCountry(country: string, status: string): Observable<CovidCases> {
    return this.http.get(`${this.API}/${country}/status/${status}`);
  }
}
