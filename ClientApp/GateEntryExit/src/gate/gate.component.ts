import { Component, OnDestroy, OnInit } from '@angular/core';
import { GateService } from '../services/gate.service';
import { GateDetailsDto } from '../models/gate/gate-details-dto';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateGateDto } from '../models/gate/create-gate-dto';
import { HttpClientModule } from '@angular/common/http';
import { PaginationConfig, PageChangedEvent } from 'ngx-bootstrap/pagination';
import { UpdateGateDto } from '../models/gate/update-gate-dto';
import { GetAllDto } from '../models/shared/get-all-dto';
import { CreateGate, DeleteGate, EditGate, GetAllGate, } from '../state/gate/gate-action';
import { Select, Store } from '@ngxs/store';
import { GateState } from '../state/gate/gate-state';
import { Observable, Subject, of, takeUntil } from 'rxjs';
import { GateDto } from '../models/gate/gate-dto';
import { GateListViewComponent } from '../gate-list-view/gate-list-view.component';

@Component({
  selector: 'app-gate',
  standalone: true,
  imports: [CommonModule, 
    ReactiveFormsModule, 
    GateListViewComponent,
    HttpClientModule],
  templateUrl: './gate.component.html',
  styleUrl: './gate.component.css',
  providers:  [GateService, PaginationConfig]
})
export class GateComponent implements OnInit, OnDestroy {
  
  selectedGateId : string | null = null;  
  totalCount : number = 0;
  lastCreatedGate : GateDto = new GateDto();
  lastUpdatedGate : GateDto = new GateDto();

  gates : GateDetailsDto[] = [];
  gateFormGroup : FormGroup = this.formBuilder.group({});
  getAllDto : GetAllDto = new GetAllDto({skipCount: 0, maxResultCount : 5, sorting : ''});

  @Select(GateState.getAllGate) gates$!: Observable<GateDetailsDto[]>;
  @Select(GateState.getLastCreatedGate) lastCreatedGate$!: Observable<GateDetailsDto>;
  @Select(GateState.getLastUpdatedGate) lastUpdatedGate$!: Observable<GateDetailsDto>;
  @Select(GateState.getTotalCount) totalCount$!: Observable<number>;

  private unSubscribeGetAllGate$ = new Subject<void>();
  private unSubscribeGetLastCreatedGate$ = new Subject<void>();
  private unSubscribeGetLastupdatedGate$ = new Subject<void>();
  private unSubscribeGetTotalCount$ = new Subject<void>();

  constructor(private store : Store,
    private formBuilder : FormBuilder){
      this.gates$.pipe(takeUntil(this.unSubscribeGetAllGate$)).subscribe(allGates => this.gates = allGates);
      this.lastCreatedGate$.pipe(takeUntil(this.unSubscribeGetLastCreatedGate$))
        .subscribe(lastCreatedGate => this.lastCreatedGate = lastCreatedGate);
      this.lastUpdatedGate$.pipe(takeUntil(this.unSubscribeGetLastupdatedGate$))
        .subscribe(lastUpdatedGate => this.lastUpdatedGate = lastUpdatedGate);
      this.totalCount$.pipe(takeUntil(this.unSubscribeGetTotalCount$))
        .subscribe(totalCount => this.totalCount = totalCount);
    }

  ngOnInit() : void{
    this.getGates(this.getAllDto);
    this.buildGateForm();
  }

  ngOnDestroy(): void {
    this.unSubscribeGetAllGate$.next();
    this.unSubscribeGetLastCreatedGate$.next();
    this.unSubscribeGetLastupdatedGate$.next();
    this.unSubscribeGetTotalCount$.next();
  }

  getGates(getAllDto : GetAllDto){
    this.store.dispatch(new GetAllGate(getAllDto)).subscribe(() => {});
  }

  buildGateForm(){
    this.gateFormGroup = this.formBuilder.group({
      name : ['', Validators.required]
    })
  }

  createOrEditGate(){
    if(this.selectedGateId){
      this.updateGate(this.selectedGateId);
    }
    else{
      this.createGate();
    }
  }

  createGate(){
    let input = new CreateGateDto();
    input.name = this.gateFormGroup.controls['name'].value;
    this.store.dispatch(new CreateGate(input)).subscribe(() => {
      this.getGates(this.getAllDto);
      this.gateFormGroup.reset();      
    });
  }

  updateGate(id : string){
    let input = new UpdateGateDto();
    input.id = id;
    input.name = this.gateFormGroup.controls['name'].value;
    this.store.dispatch(new EditGate(input)).subscribe(() => {
      this.getGates(this.getAllDto);
      this.gateFormGroup.reset();
      this.selectedGateId = null;
    });
  }

  editGate(gate : GateDetailsDto){
    this.selectedGateId = gate.id;
    this.gateFormGroup.patchValue({
      name: gate.name
    });
  }

  deleteGate(id : any){
    this.store.dispatch(new DeleteGate(id)).subscribe(() => {
      this.getGates(this.getAllDto);
    });
  }

  pageChanged(event: PageChangedEvent){
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    let input = new GetAllDto({ maxResultCount : 5, skipCount : startItem, sorting : ''});
    this.getGates(input);
  }
}
