import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GateDetailsDto } from '../models/gate/gate-details-dto';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { PaginationComponent } from '../shared/pagination/pagination.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gate-list-view',
  standalone: true,
  imports: [CommonModule,
    PaginationComponent],
  templateUrl: './gate-list-view.component.html',
  styleUrl: './gate-list-view.component.css',
  providers : []
})
export class GateListViewComponent {

  @Input() isActionEnabled : boolean = false;
  @Input() isSelectionEnabled : boolean = false;
  @Input() totalCount : number  = 0;
  @Input() gates : GateDetailsDto[] = [];
  @Input() isRadioSelection : boolean = false;
  @Input() isCheckBoxSelection : boolean = false;
  @Input() selectedGateId !: string;

/*   private _selectedGateIds : string[] = [];
  @Input() 
  set selectedGateIds(ids : string[]){
    this.selectedGateIdsKeyValue = {};
    for(let id of ids){
      this.selectedGateIdsKeyValue[id] = true;
    }
  }
  get selectedGateIds() : string[]{
    return this._selectedGateIds;
  } */

  selectedGate : GateDetailsDto = new GateDetailsDto();
  selectedGateIdsKeyValue : {[id : string] : boolean} = {};

  @Output() editClicked : EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteClicked : EventEmitter<any> = new EventEmitter<any>();
  @Output() pageClicked : EventEmitter<any> = new EventEmitter<any>();
  @Output() radioSelected : EventEmitter<any> = new EventEmitter<any>();

  constructor(){
    this.selectedGateIdsKeyValue = {};
  }

  editGate(gate : GateDetailsDto){
    this.editClicked.emit(gate);
  }

  deleteGate(id : any){
    this.deleteClicked.emit(id);
  }

  pageChanged(event: PageChangedEvent){
    this.pageClicked.emit(event);
  }  

  radioChanged(gate : GateDetailsDto){
    this.selectedGate = gate;    
    this.radioSelected.emit(this.selectedGate); 
  }

  checkBoxChanged(gate : GateDetailsDto){
    if(!this.selectedGateIdsKeyValue[gate.id]){
      this.selectedGateIdsKeyValue[gate.id] = true;
    }
    else{
      this.selectedGateIdsKeyValue[gate.id] = false;
    }
  }

  getSelectedGateIds(){
    return (Object.keys(this.selectedGateIdsKeyValue).filter(id => this.selectedGateIdsKeyValue[id]));
  }

  selectAll(event : any){    
    if(event.target.checked){
      this.selectedGateIdsKeyValue = {};
      this.gates.forEach(gate => {
        this.selectedGateIdsKeyValue[gate.id] = true;
      });
    }
    else{
      for(const id in this.selectedGateIdsKeyValue){
        this.selectedGateIdsKeyValue[id] = false;
      }
    }
  }
}
