import { TableComponent } from './components/pages/table/table.component';
import { ChartComponent } from './components/pages/chart/chart.component';

import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: '', component: TableComponent },
  { path: 'chart', component: ChartComponent },
  { path: 'table', component: TableComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
