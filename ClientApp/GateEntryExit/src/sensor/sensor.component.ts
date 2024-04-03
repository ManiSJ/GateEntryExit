import { Component, OnDestroy, OnInit } from '@angular/core';
import { SensorService } from '../services/sensor.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GateDetailsDto } from '../models/gate/gate-details-dto';
import { SensorDetailsDto } from '../models/sensor/sensor-details-dto';
import { CreateSensorDto } from '../models/sensor/create-sensor-dto';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UpdateSensorDto } from '../models/sensor/update-sensor-dto';
import { GetAllDto } from '../models/shared/get-all-dto';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { PaginationComponent } from '../shared/pagination/pagination.component';
import { BsModalRef, BsModalService, ModalModule, ModalOptions  } from 'ngx-bootstrap/modal';
import { GateModalComponent } from '../gate-modal/gate-modal.component';
import { CreateSensor, DeleteSensor, EditSensor, GetAllSensor } from '../state/sensor/sensor-action';
import { Select, Store } from '@ngxs/store';
import { SensorState } from '../state/sensor/sensor-state';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-sensor',
  standalone: true,
  imports: [CommonModule, 
    ReactiveFormsModule, 
    HttpClientModule,
    GateModalComponent,
    ModalModule,
    PaginationComponent],
  templateUrl: './sensor.component.html',
  styleUrl: './sensor.component.css',
  providers: [SensorService,
    BsModalService]
})
export class SensorComponent implements OnInit, OnDestroy{

  bsModalRef?: BsModalRef;
  selectedGateId !: string;
  selectedSensorId : string | null = null;
  gates : GateDetailsDto[] = [];
  sensorDetails : SensorDetailsDto[] = [];
  sensorFormGroup : FormGroup = this.formBuilder.group({});
  
  getAllDto : GetAllDto = new GetAllDto({skipCount: 0, maxResultCount : 5, sorting : ''});
  lastCreatedSensor : SensorDetailsDto = new SensorDetailsDto();
  lastUpdatedSensor : SensorDetailsDto = new SensorDetailsDto();
  totalCount : number = 0;

  constructor(private sensorService : SensorService,
    private modalService: BsModalService,
    private store: Store,
    private formBuilder : FormBuilder) {  
      this.sensors$.pipe(takeUntil(this.unSubscribeGetAllSensor$)).subscribe(allSensor => this.sensorDetails = allSensor);
      this.lastCreatedSensor$.pipe(takeUntil(this.unSubscribeGetLastCreatedSensor$))
        .subscribe(lastCreatedSensor => this.lastCreatedSensor = lastCreatedSensor);
      this.lastUpdatedSensor$.pipe(takeUntil(this.unSubscribeGetLastupdatedSensor$))
        .subscribe(lastUpdatedSensor => this.lastUpdatedSensor = lastUpdatedSensor);
      this.totalCount$.pipe(takeUntil(this.unSubscribeGetTotalCount$))
        .subscribe(totalCount => this.totalCount = totalCount);
  }

  @Select(SensorState.getSensors) sensors$!: Observable<SensorDetailsDto[]>;
  @Select(SensorState.getLastCreatedSensor) lastCreatedSensor$!: Observable<SensorDetailsDto>;
  @Select(SensorState.getLastUpdatedSensor) lastUpdatedSensor$!: Observable<SensorDetailsDto>;
  @Select(SensorState.getSensorTotalCount) totalCount$!: Observable<number>;

  private unSubscribeGetAllSensor$ = new Subject<void>();
  private unSubscribeGetLastCreatedSensor$ = new Subject<void>();
  private unSubscribeGetLastupdatedSensor$ = new Subject<void>();
  private unSubscribeGetTotalCount$ = new Subject<void>();
  
  ngOnInit() : void{    
    this.getSensors(this.getAllDto);
    this.buildSensorForm();
  }

  ngOnDestroy(): void {
    this.unSubscribeGetAllSensor$.next();
    this.unSubscribeGetLastCreatedSensor$.next();
    this.unSubscribeGetLastupdatedSensor$.next();
    this.unSubscribeGetTotalCount$.next();
  }

  buildSensorForm(){
    this.sensorFormGroup = this.formBuilder.group({
      sensorName : ['', Validators.required],
      gateName : ['', Validators.required],
      gateId  : ['', Validators.required]
    })
  }

  getSensors(getAllDto : GetAllDto){
    this.store.dispatch(new GetAllSensor(getAllDto)).subscribe(() => {});
  }

  createOrEditSensor(){
    if(this.selectedSensorId){
      this.updateSensor(this.selectedSensorId);
    }
    else{
      this.createSensor();
    }
  }

  createSensor(){
    let input = new CreateSensorDto();
    input.name = this.sensorFormGroup.controls['sensorName'].value;
    input.gateId = this.sensorFormGroup.controls['gateId'].value;
    this.store.dispatch(new CreateSensor(input)).subscribe(() => {
      this.getSensors(this.getAllDto);
      this.sensorFormGroup.reset();
    });
  }

  updateSensor(id : string){
    let input = new UpdateSensorDto();
    input.id = id;
    input.name = this.sensorFormGroup.controls['sensorName'].value;
    this.store.dispatch(new EditSensor(input)).subscribe(() => {
      this.getSensors(this.getAllDto);
      this.sensorFormGroup.reset();
      this.selectedSensorId = null;
    });
  }

  editSensor(sensor : SensorDetailsDto){
    this.selectedSensorId = sensor.id;
    this.sensorFormGroup.patchValue({
      sensorName: sensor.name,
      gateId : sensor.gateDetails.id,
      gateName : sensor.gateDetails.name
    });
  }

  deleteSensor(id :string){
    this.store.dispatch(new DeleteSensor(id)).subscribe(() => {
      this.getSensors(this.getAllDto);
    });
  }

  pageChanged(event: PageChangedEvent){
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    let input = new GetAllDto({skipCount: startItem, maxResultCount : 5, sorting : ''});
    this.getSensors(input)
  }

  showGateModal(){
    const initialState: ModalOptions = {
      initialState: {
        title: 'List of gates'
      }
    };
    this.bsModalRef = this.modalService.show(GateModalComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.selectedGateId = this.sensorFormGroup.controls['gateId'].value;
    
    this.bsModalRef?.content.selectedGateId$.subscribe((gate : GateDetailsDto) => 
    {      
      if(gate.id){
        this.sensorFormGroup.patchValue({
          gateId : gate.id,
          gateName : gate.name
        });
      }
    });
  }
}