
import { AppRoutingModule } from './app-routing.module';
import { ChartComponent } from './components/pages/chart/chart.component';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';


import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { AppComponent } from './app.component';
import { ToastrModule, GlobalConfig as ToastrConfig } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { TableComponent } from './components/pages/table/table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const toastrConfig: Partial<ToastrConfig> = {
  progressBar: true,
  timeOut: 2500,
};


@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    NavBarComponent,
    TableComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ChartsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(toastrConfig)
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
