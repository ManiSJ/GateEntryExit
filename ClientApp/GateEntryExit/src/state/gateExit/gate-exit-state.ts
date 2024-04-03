import { Action, Selector, State, StateContext } from "@ngxs/store";
import { GateExitDto } from "../../models/gateExit/gate-exit-dto";
import { GateExitService } from "../../services/gate-exit.service";
import { CreateGateExit, DeleteGateExit, EditGateExit, GetAllGateExit } from "./gate-exit-action";
import { tap } from "rxjs";
import { Injectable } from "@angular/core";

export class  GateExitStateModel {
    gateExits: GateExitDto[] = [];
    lastCreatedGateExit : GateExitDto =  new GateExitDto();
    lastUpdatedGateExit : GateExitDto =  new GateExitDto(); 
    totalCount : number = 0;
}
    
@State<GateExitStateModel>({
    name: 'GateExit',
    defaults: {
        gateExits: [],
        totalCount : 0,
        lastCreatedGateExit : new GateExitDto(),
        lastUpdatedGateExit : new GateExitDto()
    }
})

@Injectable()
export class GateExitState {

    constructor(private gateExitService : GateExitService){}

    @Selector()
    static getAllGateExit(state: GateExitStateModel): GateExitDto[]{
      return state.gateExits;
    }
    
    @Selector()
    static getLastCreatedGateExit(state: GateExitStateModel): GateExitDto{
      return state.lastCreatedGateExit;
    }

    @Selector()
    static getLastUpdatedGateExit(state: GateExitStateModel): GateExitDto{
      return state.lastUpdatedGateExit;
    }

    @Selector()
    static getTotalCount(state: GateExitStateModel): number{
        return state.totalCount;
    }

    @Action(GetAllGateExit)
    getAllGateExit(ctx: StateContext<GateExitStateModel>, action: GetAllGateExit){
        return this.gateExitService.getAll(action.payload).pipe(tap(data => {
            ctx.patchState({
                totalCount : data.totalCount,
                gateExits : data.items
            });
        }))
    }

    @Action(CreateGateExit)
    createGateExit(ctx: StateContext<GateExitStateModel>, action: CreateGateExit) {
        return this.gateExitService.create(action.payload).pipe(tap(data => {   
            ctx.patchState({
                lastCreatedGateExit : data
            });
        }));
    }

    @Action(EditGateExit)
    editGateExit(ctx: StateContext<GateExitStateModel>, action: EditGateExit) {
        return this.gateExitService.update(action.payload).pipe(tap(data => {   
            ctx.patchState({
                lastUpdatedGateExit : data
            });
        }));
    }

    @Action(DeleteGateExit)
    deleteGateExit(ctx: StateContext<GateExitStateModel>, action: DeleteGateExit) {
        return this.gateExitService.delete(action.payload).pipe(tap(data => {   
            ctx.patchState({
                
            });
        }));
    }
}