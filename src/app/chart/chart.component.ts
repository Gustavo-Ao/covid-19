
import { CountryService } from './../services/country.service';
import { Component, OnInit } from '@angular/core';
import { CovidCases } from '../models/cases';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html'
})
export class ChartComponent implements OnInit {

  public cases: CovidCases;
  private selectedCountry = 'brazil';
  private statusOfCases = 'recovered'
  public dateToday = new Date;
  public covidCase: number = 0;

  constructor(
    private countryService: CountryService,
    private datePipe: DatePipe
  ) { }

  public ngOnInit(): void {
    this.getDeathsByCountry(this.selectedCountry, this.statusOfCases);
    console.log(this.getDateYesterday())
  }

  public getDeathsByCountry(country: string, status: string): void {
    this.countryService.getCasesOfCountry(country, status).subscribe(data => this.cases = data);
  }

  public getDateYesterday(): string {
    const date = this.dateToday.getDate() - 1;
    const month = this.dateToday.getMonth() + 1;
    const year = this.dateToday.getFullYear();

    if (month < 10) {
      const transformDate = year + '-0' + month + '-' + date;
      return transformDate + 'T00:00:00Z';
    } else {
      const transformDate = year + '-' + month + '-' + date;
      return transformDate + 'T00:00:00Z';
    }
  }

  public formatDateToday(): string {
    const date = this.datePipe.transform(this.dateToday, 'yyyy-MM-dd');
    return date + 'T00:00:00Z';
  }

  public compareDates(date: string, cases: number): boolean {
    if (date == this.formatDateToday()) {
      console.log(date)

      this.covidCase = cases;
      return true
    } else if (date == this.getDateYesterday()) {
      console.log(date)

      this.covidCase = cases;
      return true
    }
    return false
  }
}
