import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { GateDetailsDto } from '../models/gate/gate-details-dto';
import { GateState } from '../state/gate/gate-state';
import { Select, Store } from '@ngxs/store';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { GateListViewComponent } from '../gate-list-view/gate-list-view.component';
import { GetAllDto } from '../models/shared/get-all-dto';
import { GetAllGate } from '../state/gate/gate-action';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gate-modal',
  standalone: true,
  imports: [CommonModule,
    ModalModule,
    GateListViewComponent],
  templateUrl: './gate-modal.component.html',
  styleUrl: './gate-modal.component.css'
})
export class GateModalComponent implements OnInit{

  totalCount : number = 0;
  gates : GateDetailsDto[] = [];
  title?: string;
  closeBtnName?: string;
  selectedGateId$ = new BehaviorSubject<GateDetailsDto>(new GateDetailsDto());
  getAllDto : GetAllDto = new GetAllDto({skipCount: 0, maxResultCount : 5, sorting : ''});

  selectedGateId !: string;
  selectedGateIds : string[] = [];
  
  @Select(GateState.getAllGate) gates$!: Observable<GateDetailsDto[]>;
  @Select(GateState.getTotalCount) totalCount$!: Observable<number>;

  isRadioSelection : boolean = true;
  isCheckBoxSelection : boolean = false;

  @ViewChild(GateListViewComponent)
  gateListViewComponent!: GateListViewComponent;

  private unSubscribeGetAllGate$ = new Subject<void>();
  private unSubscribeGetTotalCount$ = new Subject<void>();

  constructor(private store : Store,
    public bsModalRef: BsModalRef){
      this.gates$.pipe(takeUntil(this.unSubscribeGetAllGate$)).subscribe(allGates => this.gates = allGates);
      this.totalCount$.pipe(takeUntil(this.unSubscribeGetTotalCount$))
      .subscribe(totalCount => this.totalCount = totalCount);
  }

  ngOnInit(): void {
    this.getGates(this.getAllDto);
  }

  getGates(getAllDto : GetAllDto){
    this.store.dispatch(new GetAllGate(getAllDto)).subscribe(() => {});
  }

  ngOnDestroy(): void {
    this.unSubscribeGetAllGate$.next();
    this.unSubscribeGetTotalCount$.next();
  }

  pageChanged(event: PageChangedEvent){
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    let input = new GetAllDto({skipCount: startItem, maxResultCount : 5, sorting : ''});
    this.getGates(input);
  }

  selectedGate(gate : GateDetailsDto){
    this.selectedGateId$.next(gate);
    this.bsModalRef.hide();
  }

  getSelectedGateIds(){
    this.selectedGateIds = this.gateListViewComponent.getSelectedGateIds();
    return  this.selectedGateIds;
  } 
}
