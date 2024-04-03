import { Component, OnDestroy, OnInit } from '@angular/core';
import { SensorService } from '../services/sensor.service';
import { GetAllSensorWithDetailsOutputDto } from '../models/sensor/get-all-sensor-with-details-output-dto';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SensorDetailsDto } from '../models/sensor/sensor-details-dto';
import { GetAllSensorWithDetailsInputDto } from '../models/sensor/get-all-sensor-with-details-input-dto';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GateDetailsDto } from '../models/gate/gate-details-dto';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { PaginationComponent } from '../shared/pagination/pagination.component';
import { DatePickerComponent } from '../shared/date-picker/date-picker.component';
import { GateModalComponent } from '../gate-modal/gate-modal.component';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Select, Store } from '@ngxs/store';
import { GetAllGateById } from '../state/gate/gate-action';
import { Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { GateState } from '../state/gate/gate-state';
import { GetAllGatesDto } from '../models/gate/get-all-gates-dto';
import { GetAllSensorWithDetail } from '../state/sensor/sensor-action';
import { SensorState } from '../state/sensor/sensor-state';

@Component({
  selector: 'app-sensor-list-with-details',
  standalone: true,
  imports: [BsDatepickerModule,
    TimepickerModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationComponent,
    GateModalComponent,
    HttpClientModule,
    DatePickerComponent],
  templateUrl: './sensor-list-with-details.component.html',
  styleUrl: './sensor-list-with-details.component.css',
  providers:  [SensorService,
    BsModalService]
})
export class SensorListWithDetailsComponent implements OnInit, OnDestroy {

  bsModalRef?: BsModalRef;
  gates : GateDetailsDto[] = [];
  allSensorWithDetails : SensorDetailsDto[] = [];
  allSensorsWithDetailsFormGroup : FormGroup = this.formBuilder.group({});
  getAllDto : GetAllSensorWithDetailsInputDto = new GetAllSensorWithDetailsInputDto({skipCount: 0, maxResultCount : 5, sorting : ''});
  totalCount : number = 0;

  selectedFromDate : string = '';
  selectedToDate : string = '';

  selectedGateIds : string[] = [];
  private unSubscribeGetAllGateById$ = new Subject<void>();
  
  @Select(GateState.getAllGateById) gatesById$!: Observable<GateDetailsDto[]>;
  
  @Select(SensorState.getSensorWithDetails) sensors$!: Observable<SensorDetailsDto[]>;
  @Select(SensorState.getSensorWithDetailsTotalCount) totalCount$!: Observable<number>;

  private unSubscribeGetAllSensor$ = new Subject<void>();
  private unSubscribeGetTotalCount$ = new Subject<void>();
  
  constructor(private sensorService : SensorService,
    private modalService: BsModalService,
    private store : Store,
    private formBuilder : FormBuilder){  
      this.gatesById$.pipe(takeUntil(this.unSubscribeGetAllGateById$)).subscribe(allGates => this.gates = allGates);
      this.sensors$.pipe(takeUntil(this.unSubscribeGetAllSensor$)).subscribe(allSensor => this.allSensorWithDetails = allSensor);     
      this.totalCount$.pipe(takeUntil(this.unSubscribeGetTotalCount$))
        .subscribe(totalCount => this.totalCount = totalCount);
    }

  ngOnInit() : void{    
    this.initializeGetAll();
    this.getAllSensorsWithDetails(this.getAllDto);
  }

  ngOnDestroy(): void {
    this.unSubscribeGetAllGateById$.next();
    this.unSubscribeGetAllSensor$.next();
    this.unSubscribeGetTotalCount$.next();
  }
  
  initializeGetAll(){
    this.getAllDto.maxResultCount = 5;
    this.getAllDto.skipCount = 0 ;
    this.getAllDto.sorting = '';
    this.getAllDto.gateIds = [];
    this.getAllDto.from = null;
    this.getAllDto.to = null;
  }

  getAllSensorsWithDetails(input : GetAllSensorWithDetailsInputDto){
    this.store.dispatch(new GetAllSensorWithDetail(input)).subscribe(() => {});
  }

  filterResults(input : GetAllSensorWithDetailsInputDto)
  {
    input.gateIds = this.selectedGateIds;
    input.from = this.selectedFromDate ? this.selectedFromDate : null;
    input.to = this.selectedToDate ? this.selectedToDate : null;

    input.maxResultCount = 5;
    input.sorting = '';

    if(input.from && input.to)
    {
      if(new Date(input.from) > new Date(input.to))
      {
        alert("From date must be less than To date");
        return;
      }
    }
    this.getAllSensorsWithDetails(input);
  }

  pageChanged(event: PageChangedEvent){
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    let input = new GetAllSensorWithDetailsInputDto({skipCount: startItem, maxResultCount : 5, sorting : ''});
    this.filterResults(input)
  }

  fromDateChange(value : any){
    this.selectedFromDate = value;
  }

  toDateChange(value : any){
    this.selectedToDate = value;
  }

  showGateModal(){
    const initialState: ModalOptions = {
      initialState: {
        title: 'List of gates'
      }
    };
    this.bsModalRef = this.modalService.show(GateModalComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.isRadioSelection = false;
    this.bsModalRef.content.isCheckBoxSelection = true;
    //this.bsModalRef.content.selectedGateIds = this.selectedGateIds;  

    this.bsModalRef?.onHidden?.subscribe(() => {
      this.selectedGateIds = this.bsModalRef?.content.getSelectedGateIds();

      // This dispatch subscribe data is undefined. Don't know why its happening. That's the reason for having 
      // property gateById in gate state or else would have populated selected gates data from here itself
      this.store.dispatch(new GetAllGateById(this.selectedGateIds)).subscribe();
    }); 

    /* this.bsModalRef?.onHidden?.pipe(switchMap(() => { 
      this.selectedGateIds = this.bsModalRef?.content.getSelectedGateIds();
      return this.store.dispatch(new GetAllGateById(this.selectedGateIds));
    })).subscribe((data : GetAllGatesDto) => {
      if (data && data.items) {
        console.log('Received data:', data.items);
        this.gates = data.items;
      }
    }); */

  }
}
