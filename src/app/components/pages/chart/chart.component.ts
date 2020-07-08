import { element } from 'protractor';

import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Chart, ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

import { CountryService } from '../../../services/country.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Countries } from 'src/app/models/countries';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  @ViewChild('coutryCanvas', { static: true }) element: ElementRef;

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56], label: 'Confirmed' },
    { data: [28, 48, 40, 19, 86], label: 'Recovered' },
    { data: [28, 48, 40, 19, 86], label: 'Deaths' }
  ];

  public barChartLabels: Label[] = ['Brazil'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public cases: Countries;
  public covidCase: number = 0;

  public dateToday = new Date;

  private selectedCountry = 'brazil';
  private statusOfCases = 'confirmed'


  constructor(
    private countryService: CountryService,
    private datePipe: DatePipe
  ) { }

  public ngOnInit(): void {
    // this.getDeathsByCountry(this.selectedCountry);
    console.log(this.getDateYesterday())
  }

  // public getDeathsByCountry(country: string): void {
  //   this.countryService.getCasesConfirmedOfCountry(country).subscribe(data => this.cases = data);
  // }

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

  public randomize(): void {
    // Only Change 3 values
    const data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    this.barChartData[0].data = data;
  }
}
