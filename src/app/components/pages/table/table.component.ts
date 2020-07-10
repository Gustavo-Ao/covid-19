
import { ToastrService } from 'ngx-toastr';
import { CountryService } from './../../../services/country.service';
import { Component, OnInit } from '@angular/core';
import { Countries } from 'src/app/models/countries';
import { DatePipe } from '@angular/common';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  public headers = ["Country", "Confirmed", "Recovered", "Deaths"];
  public countriesFilter = [
    { countrySlug: 'brazil', countryCode: 'BR' },
    { countrySlug: 'portugal', countryCode: 'PT' },
    { countrySlug: 'china', countryCode: 'CN' },
    { countrySlug: 'bolivia', countryCode: 'BO' },
    { countrySlug: 'argentina', countryCode: 'AR' },
  ];

  public countries: Countries[] = [];

  public recoveredCases: number = 0;
  public dateToday = new Date;

  public formDateCases: FormGroup;

  constructor(
    private countryService: CountryService,
    private datePipe: DatePipe,
    private toastr: ToastrService
  ) { }

  public ngOnInit() {
    const date = new Date();
    const dateTransform = this.datePipe.transform(date, 'yyyy-MM-dd');

    this.getCountriesStatisticsByDate(dateTransform, true);
  }


  async getCountriesStatisticsByDate(date: string, firstLoad?: boolean) {
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

    await Promise.all(this.countriesFilter.map(({ countrySlug }) =>
      this.countryService.getCasesOfCountry({
        countrySlug,
        fromDate,
        toDate,
      })
        .then(([response]) => {
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

    if (!firstLoad) this.toastr.success('Data is updated!');
  }

}
