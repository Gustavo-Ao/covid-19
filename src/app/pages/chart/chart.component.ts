import { FormGroup, FormBuilder } from '@angular/forms';
import { CountryService } from './../../services/country.service';
import { ToastrService } from 'ngx-toastr';

import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Countries } from 'src/app/models/countries';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

interface UpdateChartData {
  confirmed: number;
  recovered: number;
  deaths: number;
}

interface CountriesSelect {
  countrySlug: string,
  countryCode: string,
  countryName: string
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  @ViewChild('coutryCanvas', { static: true }) element: ElementRef;

  public casesSubscribe: Subscription;

  //Config bar chart
  public barChartOptions: ChartOptions = {
    responsive: true,
    layout: {
      padding: { bottom: 50 },
    },
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    },
    legend: {
      labels: { fontSize: 15 }
    },
  };

  //COnfig pie chart
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: { position: 'top' },
    layout: {
      padding: { top: 50 },
    },
    plugins: {
      datalabels: {
        formatter: (_, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    },
    aspectRatio: 1.5,
  }

  public barChartData: ChartDataSets[] = [
    { data: [0], label: 'Confirmed' },
    { data: [0], label: 'Recovered' },
    { data: [0], label: 'Deaths' }
  ];
  public barChartLabels: Label[] = ['Brazil'];
  public chartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  // Configuration of pie chart
  public pieChartLabels: Label[] = ['Confirmed', 'Recovered', 'Deaths'];
  public pieChartData: number[] = [0, 0, 0];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public chartColors = [{ backgroundColor: ['#06d6a0', '#f15bb5', '#eeef20'] }];

  public countriesFilter = [
    { countrySlug: 'brazil', countryCode: 'BR', countryName: 'Brazil' },
    { countrySlug: 'portugal', countryCode: 'PT', countryName: 'Portugal' },
    { countrySlug: 'china', countryCode: 'CN', countryName: 'China' },
    { countrySlug: 'mexico', countryCode: 'MX', countryName: 'Mexico' },
    { countrySlug: 'argentina', countryCode: 'AR', countryName: 'Argentina' },
  ];

  public countrySelect: string;
  public countries: Countries = {} as Countries;

  public cases: Countries;
  public covidCase: number = 0;

  public dateToday = new Date;
  public dateInput: string;

  public formChangeCountry: FormGroup;

  // Retriever browser resolution
  public width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  public height = (window.innerHeight > 0) ? window.innerHeight : screen.height;

  public teste = window.onresize;

  constructor(
    private route: ActivatedRoute,
    private coutryService: CountryService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.formChangeCountry = this.formBuilder.group({
      countrySearch: [null]
    });
  }

  public ngOnInit(): void {

    //retrieving route data
    const {
      Country,
      Confirmed,
      Deaths,
      Recovered,
      Date,
      Slug,
    } = this.route.snapshot.queryParams;

    this.countries.Country = Country;
    this.countries.Confirmed = Confirmed;
    this.countries.Deaths = Deaths;
    this.countries.Recovered = Recovered;
    this.countries.Date = Date;
    this.countries.Slug = Slug;

    this.changeDataChart({
      confirmed: Number(Confirmed),
      recovered: Number(Recovered),
      deaths: Number(Deaths),
    });
  }

  async getCountriesStatisticsByDate(date: string): Promise<void> {
    this.dateInput = date;
    const [year, month, day] = date.split('-').map(Number); //  format date

    const fromDate = new Date(year, month - 1, day);
    const toDate = new Date(year, month - 1, day + 1)

    fromDate.setUTCHours(0);
    toDate.setUTCHours(0);

    const currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    if (date === currentDate) {
      fromDate.setDate(fromDate.getDate() - 1);
      toDate.setDate(toDate.getDate() - 1);
    }

    // call service
    this.casesSubscribe = this.coutryService.getCasesOfCountry({
      countrySlug: this.countries.Slug,
      fromDate,
      toDate,
    })
      .subscribe(([response]) => {
        const responseCountry = response;

        this.countries = Object.assign(this.countries, responseCountry);
      });

    this.changeDataChart({
      confirmed: this.countries.Confirmed,
      recovered: this.countries.Recovered,
      deaths: this.countries.Deaths,
    });

    this.toastr.success(null, 'Data has been updated!');
  }

  // Action for resolution change in browser
  public changeResolution() {
    this.width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    this.height = (window.innerHeight > 0) ? window.innerHeight : screen.height;

    if (this.width > 990 && this.width < 1000) {
      this.toastr.info(null, 'The chart has been changed for you better experience!');
    }
  }

  async changeChartData(date: string, countrySlug: string): Promise<void> {
    const [year, month, day] = date.split('-').map(Number);

    const fromDate = new Date(year, month - 1, day);
    const toDate = new Date(year, month - 1, day + 1)

    fromDate.setUTCHours(0);
    toDate.setUTCHours(0);

    const currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    if (date === currentDate) {
      fromDate.setDate(fromDate.getDate() - 1);
      toDate.setDate(toDate.getDate() - 1);
    }

    this.casesSubscribe = this.coutryService.getCasesOfCountry({
      countrySlug: countrySlug,
      fromDate,
      toDate,
    })
      .subscribe(([response]) => {
        const responseCountry = response;

        this.countries = Object.assign(this.countries, responseCountry);
      });

    this.changeDataChart({
      confirmed: this.countries.Confirmed,
      recovered: this.countries.Recovered,
      deaths: this.countries.Deaths,
    });

    this.toastr.success(null, 'Data has been updated!');
  }

  async changeCountry(country: CountriesSelect) {
    // Format date
    const countrySlug = country.countryCode;
    const dateFormat: string = this.datePipe.transform(this.countries.Date, 'yyyy-MM-dd');

    this.barChartLabels[0] = country.countryName;
    console.log('teste', countrySlug)
    console.log('Data teste', this.dateInput)

    // Call changeChartData() in changing date
    if (this.dateInput) {
      this.changeChartData(this.dateInput, countrySlug);
    } else {
      this.changeChartData(dateFormat, countrySlug);
    }
  }

  public changeDataChart({ confirmed, recovered, deaths }: UpdateChartData): void {
    this.barChartData = [
      { data: [confirmed], label: 'Confirmed' },
      { data: [recovered], label: 'Recovered' },
      { data: [deaths], label: 'Deaths' }
    ];

    this.pieChartData = [confirmed, recovered, deaths];
  }
}
