import { Component, OnDestroy, OnInit } from '@angular/core';
import { GateEntryService } from '../services/gate-entry.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GateService } from '../services/gate.service';
import { GateDetailsDto } from '../models/gate/gate-details-dto';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { CreateGateEntryDto } from '../models/gateEntry/create-gate-entry-dto';
import { UpdateGateEntryDto } from '../models/gateEntry/update-gate-entry-dto';
import { GateExitService } from '../services/gate-exit.service';
import { UpdateGateExitDto } from '../models/gateExit/update-gate-exit-dto';
import { CreateGateExitDto } from '../models/gateExit/create-gate-exit-dto';
import { GateEntryComponent } from '../gate-entry/gate-entry.component';
import { GateExitComponent } from '../gate-exit/gate-exit.component';
import { DatePickerComponent } from '../shared/date-picker/date-picker.component';
import { GetAllDto } from '../models/shared/get-all-dto';
import { GateModalComponent } from '../gate-modal/gate-modal.component';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Store } from '@ngxs/store';
import { CreateGateExit, EditGateExit, GetAllGateExit } from '../state/gateExit/gate-exit-action';
import { CreateGateEntry, EditGateEntry, GetAllGateEntry } from '../state/gateEntry/gate-entry-action';

@Component({
  selector: 'app-gate-entry-exit',
  standalone: true,
  imports: [BsDatepickerModule,
    TimepickerModule,
    CommonModule,
    GateEntryComponent,
    GateExitComponent,
    GateModalComponent,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DatePickerComponent],
  templateUrl: './gate-entry-exit.component.html',
  styleUrl: './gate-entry-exit.component.css',
  providers:  [GateService, 
    GateEntryService, 
    GateExitService,
    BsModalService]
})
export class GateEntryExitComponent implements OnInit, OnDestroy{

  bsModalRef?: BsModalRef;
  selectedGateEntryExitId : string | null = null;
  gates : GateDetailsDto[] = [];
  getAllDto : GetAllDto = new GetAllDto({skipCount: 0, maxResultCount : 5, sorting : ''});
  gateEntryExitFormGroup: FormGroup = this.formBuilder.group({});

  selectedDate : string = '';
  
  constructor(private gateEntryService : GateEntryService,
    private gateExitService : GateExitService,
    private modalService: BsModalService,
    private store : Store,
    private formBuilder : FormBuilder){
    }  

  ngOnInit() : void{
    this.buildGateEntryExitForm();
  }

  ngOnDestroy(): void {
  }

  buildGateEntryExitForm(){
    this.gateEntryExitFormGroup = this.formBuilder.group({
      gateName : ['', Validators.required],
      peopleCount : ['', Validators.required],
      gateOperation : ['entry', Validators.required],
      gateId  : ['', Validators.required]
    })
  }

  createOrEditGateEntryExit(){
    let gateOperation = this.gateEntryExitFormGroup.controls['gateOperation'].value;

    if(gateOperation == 'entry'){
      if(this.selectedGateEntryExitId){
        this.updateGateEntry(this.selectedGateEntryExitId);
      }
      else{
        this.createGateEntry();
      }
    }
    else if(gateOperation == 'exit'){
      if(this.selectedGateEntryExitId){
        this.updateGateExit(this.selectedGateEntryExitId);
      }
      else{
        this.createGateExit();
      }
    }
  }

  createGateEntry(){
    let input = new CreateGateEntryDto();
    input.gateId = this.gateEntryExitFormGroup.controls['gateId'].value;
    input.timeStamp = this.selectedDate ? this.selectedDate : '';
    input.numberOfPeople = this.gateEntryExitFormGroup.controls['peopleCount'].value;
    this.store.dispatch(new CreateGateEntry(input)).subscribe(() => {
      this.store.dispatch(new GetAllGateEntry(new GetAllDto({skipCount: 0, maxResultCount : 5, sorting : ''}))).subscribe();
      this.gateEntryExitFormGroup.reset();   
      this.selectedDate = ''; 
    });
  }

  updateGateEntry(id : string){
    let input = new UpdateGateEntryDto();
    input.id = id;
    input.timeStamp = this.selectedDate ? this.selectedDate : '';
    input.numberOfPeople = this.gateEntryExitFormGroup.controls['peopleCount'].value;
    this.store.dispatch(new EditGateEntry(input)).subscribe(() => {
      this.store.dispatch(new GetAllGateEntry(new GetAllDto({skipCount: 0, maxResultCount : 5, sorting : ''}))).subscribe();
      this.gateEntryExitFormGroup.reset();   
      this.selectedGateEntryExitId = null;
      this.selectedDate = '';
    });
  }

  createGateExit(){
    let input = new CreateGateExitDto();
    input.gateId = this.gateEntryExitFormGroup.controls['gateId'].value;
    input.timeStamp = this.selectedDate ? this.selectedDate : '';
    input.numberOfPeople = this.gateEntryExitFormGroup.controls['peopleCount'].value;
    this.store.dispatch(new CreateGateExit(input)).subscribe(() => {
      this.store.dispatch(new GetAllGateExit(new GetAllDto({skipCount: 0, maxResultCount : 5, sorting : ''}))).subscribe();
      this.gateEntryExitFormGroup.reset();   
      this.selectedDate = '';
    });
  }

  updateGateExit(id : string){
    let input = new UpdateGateExitDto();
    input.id = id;
    input.timeStamp = this.selectedDate ? this.selectedDate : '';
    input.numberOfPeople = this.gateEntryExitFormGroup.controls['peopleCount'].value;
    this.store.dispatch(new EditGateExit(input)).subscribe(() => {
      this.store.dispatch(new GetAllGateExit(new GetAllDto({skipCount: 0, maxResultCount : 5, sorting : ''}))).subscribe();
      this.gateEntryExitFormGroup.reset();   
      this.selectedGateEntryExitId = null;
      this.selectedDate = '';
    });
  }

  editGateEntry(event : any){
    this.selectedGateEntryExitId = event.id;
    this.selectedDate = event.timeStamp;
    this.gateEntryExitFormGroup.patchValue({
      gateName : event.gateName,
      gateId : event.gateId,
      peopleCount :  event.numberOfPeople,
      gateOperation : 'entry'
    });
  }

  editGateExit(event : any){
    this.selectedGateEntryExitId = event.id;
    this.selectedDate = event.timeStamp;
    this.gateEntryExitFormGroup.patchValue({
      gateName : event.gateName,
      gateId : event.gateId,
      peopleCount :  event.numberOfPeople,
      gateOperation : 'exit'
    });
  }

  dateChange(value : any){
    this.selectedDate = value;
  }  

  showGateModal(){
    const initialState: ModalOptions = {
      initialState: {
        title: 'List of gates'
      }
    };
    this.bsModalRef = this.modalService.show(GateModalComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.selectedGateId = this.gateEntryExitFormGroup.controls['gateId'].value;
    
    this.bsModalRef?.content.selectedGateId$.subscribe((gate : GateDetailsDto) => 
    {      
      if(gate.id){
        this.gateEntryExitFormGroup.patchValue({
          gateId : gate.id,
          gateName : gate.name
        });
      }
    });
  }
}
