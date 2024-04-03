import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [PaginationModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {

  @Input() totalCount: number = 0;
  @Output() pageChangedEvent : EventEmitter<any> = new EventEmitter<any>();

  constructor(){}

  pageChanged(event : any){
    this.pageChangedEvent.emit(event);
  }
}
