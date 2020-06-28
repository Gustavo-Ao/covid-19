import { Observable } from 'rxjs';
import { CountryService } from './../../../services/country.service';
import { Component, OnInit } from '@angular/core';
import { CovidCases } from 'src/app/models/cases';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  public headers = ["ID", "Country", "Confirmed", "Recovered", "Deaths"];

  public cases: CovidCases;

  public selectedCountry = 'Brazil'
  public statusOfCases = 'recovered';
  public recoveredCases: number = 0;
  public dateToday = new Date;

  constructor(
    private countryService: CountryService,
    private datePipe: DatePipe
  ) { }

  public ngOnInit(): void {

    this.getDeathsByCountry(this.selectedCountry, this.statusOfCases);
  }

  public async getDeathsByCountry(country: string, status: string) {
    await this.countryService.getCasesOfCountry(country, status).subscribe(data => this.cases = data);
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

  public compareDates(date: string, cases: number, coutry: string): boolean {
    if (date == this.formatDateToday()) {
      console.log(date)

      this.recoveredCases = cases;
      return true
    } else if (date == this.getDateYesterday()) {
      console.log(date)

      this.recoveredCases = cases;
      return true
    }
    return false
  }

}
