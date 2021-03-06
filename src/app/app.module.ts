import { ChartComponent } from './pages/chart/chart.component';
import { TableComponent } from './pages/table/table.component';

import { AppRoutingModule } from './app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';

import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { AppComponent } from './app.component';
import { ToastrModule, GlobalConfig as ToastrConfig } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchHeaderComponent } from './components/search-header/search-header.component';

const toastrConfig: Partial<ToastrConfig> = {
  progressBar: true,
  timeOut: 2500,
};


@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    NavBarComponent,
    TableComponent,
    SearchHeaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ChartsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(toastrConfig),
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
