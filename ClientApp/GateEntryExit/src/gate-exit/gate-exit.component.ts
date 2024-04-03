import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { GateExitService } from '../services/gate-exit.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { GateDetailsDto } from '../models/gate/gate-details-dto';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { GateExitDto } from '../models/gateExit/gate-exit-dto';
import { GetAllDto } from '../models/shared/get-all-dto';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { PaginationComponent } from '../shared/pagination/pagination.component';
import { GateExitState } from '../state/gateExit/gate-exit-state';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DeleteGateExit, GetAllGateExit } from '../state/gateExit/gate-exit-action';

@Component({
  selector: 'app-gate-exit',
  standalone: true,
  imports: [BsDatepickerModule,
    TimepickerModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationComponent,
    HttpClientModule],
  templateUrl: './gate-exit.component.html',
  styleUrl: './gate-exit.component.css',
  providers: [GateExitService]
})
export class GateExitComponent implements OnInit, OnDestroy{

  @Output() gateExitEdit : EventEmitter<any> = new EventEmitter<any>();

  selectedGateExitId : string | null = null;
  gateExits : GateExitDto[] = [];
  gateExitFormGroup: FormGroup = this.formBuilder.group({});
  
  getAllDto : GetAllDto = new GetAllDto({skipCount: 0, maxResultCount : 5, sorting : ''});  
  totalCount : number = 0;
  lastCreatedGateEntry : GateExitDto = new GateExitDto();
  lastUpdatedGateEntry : GateExitDto = new GateExitDto();

  @Select(GateExitState.getAllGateExit) gateExits$!: Observable<GateExitDto[]>;
  @Select(GateExitState.getLastCreatedGateExit) lastCreatedGateEntry$!: Observable<GateExitDto>;
  @Select(GateExitState.getLastUpdatedGateExit) lastUpdatedGateEntry$!: Observable<GateExitDto>;
  @Select(GateExitState.getTotalCount) totalCount$!: Observable<number>;

  private unSubscribeGetAllGateExit$ = new Subject<void>();
  private unSubscribeGetLastCreatedGateExit$ = new Subject<void>();
  private unSubscribeGetLastupdatedGateExit$ = new Subject<void>();
  private unSubscribeGetTotalCount$ = new Subject<void>();

  constructor(private gateExitService : GateExitService,
    private store : Store,
    private formBuilder : FormBuilder){
      this.gateExits$.pipe(takeUntil(this.unSubscribeGetAllGateExit$)).subscribe(allGateExit => this.gateExits = allGateExit);
      this.lastCreatedGateEntry$.pipe(takeUntil(this.unSubscribeGetLastCreatedGateExit$))
        .subscribe(lastCreatedGate => this.lastCreatedGateEntry = lastCreatedGate);
      this.lastUpdatedGateEntry$.pipe(takeUntil(this.unSubscribeGetLastupdatedGateExit$))
        .subscribe(lastUpdatedGate => this.lastUpdatedGateEntry = lastUpdatedGate);
      this.totalCount$.pipe(takeUntil(this.unSubscribeGetTotalCount$))
        .subscribe(totalCount => this.totalCount = totalCount);
    }  

  ngOnInit() : void{
    this.getGateExits(this.getAllDto);
  }

  ngOnDestroy(): void {
    this.unSubscribeGetAllGateExit$.next();
    this.unSubscribeGetLastCreatedGateExit$.next();
    this.unSubscribeGetLastupdatedGateExit$.next();
    this.unSubscribeGetTotalCount$.next();
  }

  getGateExits(getAllDto : GetAllDto){ 
    this.store.dispatch(new GetAllGateExit(getAllDto)).subscribe(() => {});
  }

  editGateExit(gateExit : GateExitDto){    
    this.gateExitEdit.emit({
      id : gateExit.id,
      gateId : gateExit.gateId,
      gateName : gateExit.gateName,
      timeStamp : gateExit.timeStamp,
      numberOfPeople : gateExit.numberOfPeople
    });
  }

  deleteGateExit(id : string){
    this.store.dispatch(new DeleteGateExit(id)).subscribe(() => {
      this.getGateExits(this.getAllDto);
    });
  }

  pageChanged(event: PageChangedEvent){
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    let input = new GetAllDto({skipCount: startItem, maxResultCount : 5, sorting : ''});
    this.getGateExits(input);
  }
}
