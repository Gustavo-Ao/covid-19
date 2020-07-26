import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-search-header',
  templateUrl: './search-header.component.html',
  styleUrls: ['./search-header.component.scss']
})
export class SearchHeaderComponent implements OnInit {
  @Input() date?: Date;

  @Output() submitFn: EventEmitter<any> = new EventEmitter();

  public searchForm: FormGroup;

  public dateNow = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
  ) { }

  public ngOnInit(): void {
    // Format date
    const date = this.datePipe.transform(
      this.date || new Date(), 'yyyy-MM-dd',
    );

    const [year, month, day] = date.split('-').map(Number);

    const formattedDate = this.datePipe.transform(
      new Date(year, month - 1, day), 'yyyy-MM-dd',
    );

    this.searchForm = this.formBuilder.group({
      date: [formattedDate, Validators.required]
    })
  }

  public handleSubmitSearchForm(): void {
    if (this.searchForm.invalid) return;

    const { date } = this.searchForm.getRawValue();

    if (date > this.datePipe.transform(this.dateNow, 'yyyy-MM-dd')) {
      this.toastr.warning(null, 'Date can not be larger the current date!');
      return;
    }

    this.submitFn.emit(date);
  }

}
