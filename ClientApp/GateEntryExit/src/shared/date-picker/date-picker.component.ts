import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [BsDatepickerModule,
    TimepickerModule,
    CommonModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css'
})
export class DatePickerComponent {

  private _datePickerValue : any;

  @Input() 
  set datePickerValue(value : any){
    if(value){
      this._datePickerValue = new Date(value);
    }
    else{
      this._datePickerValue = '';
    }
  }
  get datePickerValue() : any{
    return this._datePickerValue;
  }

  @Output() dateChange : EventEmitter<any> = new EventEmitter<any>();

  constructor(){

  }

  onValueChange(value: Date){
    this.dateChange.emit(value);
  }
}
