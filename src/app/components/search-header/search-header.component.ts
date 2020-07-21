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

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) { }

  public ngOnInit(): void {
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
    console.log('date', date)
    this.submitFn.emit(date);
  }

}
