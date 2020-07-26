import { CountryService } from './../../services/country.service';
import { Countries } from './../../models/countries';
import { TotalCasesOfTheWorld } from './../../models/totalCases';


import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  public countriesSubcription: Subscription;
  public worldCasesSubcription: Subscription;

  // standard info of table
  public headers = ["Country", "Confirmed", "Recovered", "Deaths"];
  public countriesFilter = [
    { countrySlug: 'brazil', countryCode: 'BR' },
    { countrySlug: 'portugal', countryCode: 'PT' },
    { countrySlug: 'china', countryCode: 'CN' },
    { countrySlug: 'mexico', countryCode: 'MX' },
    { countrySlug: 'argentina', countryCode: 'AR' },
  ];

  public countries: Countries[] = [];
  public worldCases: TotalCasesOfTheWorld;

  public recoveredCases: number = 0;
  public dateToday = new Date;

  public formDateCases: FormGroup;

  constructor(
    private router: Router,
    private countryService: CountryService,
    private datePipe: DatePipe,
    private toastr: ToastrService
  ) { }

  async ngOnInit(): Promise<void> {
    // format date
    const date = new Date();
    const dateTransform = this.datePipe.transform(date, 'yyyy-MM-dd');

    // get data of world cases in service
    this.worldCasesSubcription = this.countryService.getTotalCasesInTheWorld()
      .subscribe(cases => this.worldCases = cases)

    this.getCountriesStatisticsByDate(dateTransform, true);
  }

  async getCountriesStatisticsByDate(date: string, firstLoad?: boolean): Promise<void> {
    // format date
    const [year, month, day] = date.split('-').map(Number);
    this.dateToday = new Date(year, month - 1, day);

    const fromDate = new Date(year, month - 1, day);
    const toDate = new Date(year, month - 1, day + 1)

    fromDate.setUTCHours(0);
    toDate.setUTCHours(0);

    const currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    if (date === currentDate) {
      fromDate.setDate(fromDate.getDate() - 1);
      toDate.setDate(toDate.getDate() - 1);
    }

    // call of getCasesOfCountry in service
    await forkJoin(this.countriesFilter.map(({ countrySlug }) =>
      this.countriesSubcription = this.countryService.getCasesOfCountry({
        countrySlug,
        fromDate,
        toDate,
      })
        .subscribe(([response]) => {
          const countryIndex = this.countries.findIndex(
            country => country.CountryCode === response.CountryCode
          );

          if (countryIndex >= 0) {
            this.countries[countryIndex] = response;
            return;
          }

          this.countries.push(response);
        }),
    ));

    if (!firstLoad) this.toastr.success('Data has been updated!');
  }

  public handleOpenChart(country: Countries): void {
    const [{ countrySlug }] = this.countriesFilter.filter(
      countryItem => countryItem.countryCode === country.CountryCode
    );

    // listening to route data
    this.router.navigate(['/chart'], {
      queryParams: {
        Country: country.Country,
        Deaths: country.Deaths,
        Confirmed: country.Confirmed,
        Recovered: country.Recovered,
        Date: this.dateToday.toISOString(),
        Slug: countrySlug,
      },
    });
  }

  ngOnDestroy(): void {
    this.countriesSubcription.unsubscribe();
    this.worldCasesSubcription.unsubscribe();
  }

}
