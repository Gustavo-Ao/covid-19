import { AppRoutingModule } from './app-routing.module';
import { ChartComponent } from './components/pages/chart/chart.component';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { TableComponent } from './components/pages/table/table.component';

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
    AppRoutingModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
