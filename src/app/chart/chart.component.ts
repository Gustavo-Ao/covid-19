import { Observable } from 'rxjs';
import { Info } from './../models/info';
import { CountryService } from './../services/country.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html'
})
export class ChartComponent implements OnInit {

  info$: Observable<Info[]>;

  constructor(
    private countryService: CountryService
  ) {}

  ngOnInit() {
    this.info$ = this.countryService.getCountry('brazil');
  }

}
