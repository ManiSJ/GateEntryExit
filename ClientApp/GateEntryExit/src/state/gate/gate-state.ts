import { Action, Selector, State, StateContext } from "@ngxs/store";
import { GateDetailsDto } from "../../models/gate/gate-details-dto";
import { Injectable } from "@angular/core";
import { CreateGate, DeleteGate, EditGate, GetAllGate, GetAllGateById } from "./gate-action";
import { GateService } from "../../services/gate.service";
import { tap } from "rxjs/operators";
import { GateDto } from "../../models/gate/gate-dto";
import { GetAllDto } from "../../models/shared/get-all-dto";
import { Observable } from "rxjs";
import { GetAllGatesDto } from "../../models/gate/get-all-gates-dto";

export class  GateStateModel {
    gates: GateDetailsDto[] = [];
    gatesById : GateDetailsDto[] = [];
    lastCreatedGate : GateDto =  new GateDto();
    lastUpdatedGate : GateDto =  new GateDto(); 
    totalCount : number = 0;
}
    
@State<GateStateModel>({
    name: 'gate',
    defaults: {
        gates: [],
        gatesById : [],
        totalCount : 0,
        lastCreatedGate : new GateDetailsDto(),
        lastUpdatedGate : new GateDetailsDto()
    }
})

@Injectable()
export class GateState {

    constructor(private gateService : GateService){}

    @Selector()
    static getAllGate(state: GateStateModel): GateDetailsDto[]{
      return state.gates;
    }

    @Selector()
    static getAllGateById(state: GateStateModel): GateDetailsDto[]{
      return state.gatesById;
    }

    @Selector()
    static getLastCreatedGate(state: GateStateModel): GateDto{
      return state.lastCreatedGate;
    }

    @Selector()
    static getLastUpdatedGate(state: GateStateModel): GateDto{
      return state.lastUpdatedGate;
    }

    @Selector()
    static getTotalCount(state: GateStateModel): number{
        return state.totalCount;
    }

    @Action(GetAllGate)
    getAllGate(ctx: StateContext<GateStateModel>, action: GetAllGate){
        return this.gateService.getAll(action.payload).pipe(tap(data => {
            ctx.patchState({
                totalCount : data.totalCount,
                gates: data.items
            });
        }))
    }

    
    @Action(GetAllGateById)
    getAllGateById(ctx: StateContext<GateStateModel>, action: GetAllGateById) : Observable<GetAllGatesDto>{
        return this.gateService.getAllById(action.payload).pipe(tap(data => {
            ctx.patchState({
                gatesById: data.items
            });
        }))
    }
    
    @Action(CreateGate)
    createGate(ctx: StateContext<GateStateModel>, action: CreateGate) {
        return this.gateService.create(action.payload).pipe(tap(data => {   
            ctx.patchState({
                lastCreatedGate : data
            });
        }));
    }

    @Action(EditGate)
    editGate(ctx: StateContext<GateStateModel>, action: EditGate) {
        return this.gateService.update(action.payload).pipe(tap(data => {   
            ctx.patchState({
                lastUpdatedGate : data
            });
        }));
    }

    @Action(DeleteGate)
    deleteGate(ctx: StateContext<GateStateModel>, action: DeleteGate) {
        return this.gateService.delete(action.payload).pipe(tap(data => {   
            ctx.patchState({
                
            });
        }));
    }
}