import { CountryService } from './../../services/country.service';
import { ToastrService } from 'ngx-toastr';

import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Countries } from 'src/app/models/countries';
import { ActivatedRoute } from '@angular/router';

interface UpdateChartData {
  confirmed: number;
  recovered: number;
  deaths: number;
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  @ViewChild('coutryCanvas', { static: true }) element: ElementRef;

  public barChartOptions: ChartOptions = {
    responsive: true,
    layout: {
      padding: { bottom: 50 }
    },
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    },
    legend: {
      labels: { fontSize: 17 }
    }
  };

  public barChartData: ChartDataSets[] = [
    { data: [0], label: 'Confirmed' },
    { data: [0], label: 'Recovered' },
    { data: [0], label: 'Deaths' }
  ];
  public barChartLabels: Label[] = ['Brazil'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public countries: Countries = {} as Countries;

  public cases: Countries;
  public covidCase: number = 0;

  public dateToday = new Date;

  constructor(
    private route: ActivatedRoute,
    private coutryService: CountryService,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) { }

  public ngOnInit(): void {
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

    const [responseCountry] = await this.coutryService.getCasesOfCountry({
      countrySlug: this.countries.Slug,
      fromDate,
      toDate,
    });

    this.countries = Object.assign(this.countries, responseCountry);

    this.changeDataChart({
      confirmed: this.countries.Confirmed,
      recovered: this.countries.Recovered,
      deaths: this.countries.Deaths,
    });

    this.toastr.success(null, 'Data has been updated!');
  }

  public changeDataChart({ confirmed, recovered, deaths }: UpdateChartData): void {
    this.barChartData = [
      { data: [confirmed], label: 'Confirmed' },
      { data: [recovered], label: 'Recovered' },
      { data: [deaths], label: 'Deaths' }
    ];
  }
}
