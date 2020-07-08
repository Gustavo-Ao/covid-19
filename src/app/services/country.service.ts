import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Countries } from '../models/countries';

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

  getCasesOfCountry({
    countrySlug,
    fromDate,
    toDate,
  }: GetCountryByDateDTO): Promise<Countries[]> {
    const fromDateString = fromDate.toISOString();
    const toDateString = toDate.toISOString();
    const endpoint = `country/${countrySlug}?from=${fromDateString}&to=${toDateString}`;

    return this.http
      .get<Countries[]>(`${this.URL}/${endpoint}`)
      .toPromise();
  }
}
