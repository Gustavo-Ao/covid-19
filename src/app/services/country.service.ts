import { TotalCasesOfTheWorld } from './../models/totalCases';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Countries } from '../models/countries';
import { Observable } from 'rxjs';

interface GetCountryByDateDTO {
  countrySlug: string;
  fromDate: Date;
  toDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private URL: string = 'https://api.covid19api.com';

  constructor(
    private http: HttpClient,
  ) { }

  public getTotalCasesInTheWorld(): Observable<TotalCasesOfTheWorld> {
    return this.http.get<TotalCasesOfTheWorld>(`${this.URL}/world/total`);
  }

  public getCasesOfCountry({
    countrySlug,
    fromDate,
    toDate,
  }: GetCountryByDateDTO): Observable<Countries[]> {
    const fromDateString = fromDate.toISOString();
    const toDateString = toDate.toISOString();
    const endpoint = `country/${countrySlug}?from=${fromDateString}&to=${toDateString}`;

    return this.http
      .get<Countries[]>(`${this.URL}/${endpoint}`)
  }
}
