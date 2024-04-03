import { Action, Selector, State, StateContext } from "@ngxs/store";
import { GateEntryDto } from "../../models/gateEntry/gate-entry-dto";
import { GateEntryService } from "../../services/gate-entry.service";
import { CreateGateEntry, DeleteGateEntry, EditGateEntry, GetAllGateEntry } from "./gate-entry-action";
import { tap } from "rxjs";
import { Injectable } from "@angular/core";

export class  GateEntryStateModel {
    gateEntries: GateEntryDto[] = [];
    lastCreatedGateEntry : GateEntryDto =  new GateEntryDto();
    lastUpdatedGateEntry : GateEntryDto =  new GateEntryDto(); 
    totalCount : number = 0;
}
    
@State<GateEntryStateModel>({
    name: 'GateEntry',
    defaults: {
        gateEntries: [],
        totalCount : 0,
        lastCreatedGateEntry : new GateEntryDto(),
        lastUpdatedGateEntry : new GateEntryDto()
    }
})

@Injectable()
export class GateEntryState {

    constructor(private gateEntryService : GateEntryService){}

    @Selector()
    static getAllGateEntry(state: GateEntryStateModel): GateEntryDto[]{
      return state.gateEntries;
    }
    
    @Selector()
    static getLastCreatedGateEntry(state: GateEntryStateModel): GateEntryDto{
      return state.lastCreatedGateEntry;
    }

    @Selector()
    static getLastUpdatedGateEntry(state: GateEntryStateModel): GateEntryDto{
      return state.lastUpdatedGateEntry;
    }

    @Selector()
    static getTotalCount(state: GateEntryStateModel): number{
        return state.totalCount;
    }

    @Action(GetAllGateEntry)
    getAllGateEntry(ctx: StateContext<GateEntryStateModel>, action: GetAllGateEntry){
        return this.gateEntryService.getAll(action.payload).pipe(tap(data => {
            ctx.patchState({
                totalCount : data.totalCount,
                gateEntries : data.items
            });
        }))
    }

    @Action(CreateGateEntry)
    createGateEntry(ctx: StateContext<GateEntryStateModel>, action: CreateGateEntry) {
        return this.gateEntryService.create(action.payload).pipe(tap(data => {   
            ctx.patchState({
                lastCreatedGateEntry : data
            });
        }));
    }

    @Action(EditGateEntry)
    editGateEntry(ctx: StateContext<GateEntryStateModel>, action: EditGateEntry) {
        return this.gateEntryService.update(action.payload).pipe(tap(data => {   
            ctx.patchState({
                lastUpdatedGateEntry : data
            });
        }));
    }

    @Action(DeleteGateEntry)
    deleteGateEntry(ctx: StateContext<GateEntryStateModel>, action: DeleteGateEntry) {
        return this.gateEntryService.delete(action.payload).pipe(tap(data => {   
            ctx.patchState({
                
            });
        }));
    }
}