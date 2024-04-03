import { Action, Selector, State, StateContext } from "@ngxs/store";
import { SensorDetailsDto } from "../../models/sensor/sensor-details-dto";
import { CreateSensor, DeleteSensor, EditSensor, GetAllSensorWithDetail, GetAllSensor } from "./sensor-action";
import { tap } from "rxjs";
import { SensorService } from "../../services/sensor.service";
import { Injectable } from "@angular/core";

export class  SensorStateModel {
    sensors: SensorDetailsDto[] = [];    
    sensorsTotalCount : number = 0;
    sensorWithDetails : SensorDetailsDto[] = [];    
    sensorWithDetailsTotalCount : number = 0;
    lastCreatedSensor : SensorDetailsDto =  new SensorDetailsDto();
    lastUpdatedSensor : SensorDetailsDto =  new SensorDetailsDto(); 
}
    
@State<SensorStateModel>({
    name: 'Sensor',
    defaults: {
        sensors: [],
        sensorsTotalCount : 0,
        sensorWithDetails: [],
        sensorWithDetailsTotalCount : 0,
        lastCreatedSensor : new SensorDetailsDto(),
        lastUpdatedSensor : new SensorDetailsDto()
    }
})

@Injectable()
export class SensorState {

    constructor(private sensorService : SensorService){}

    @Selector()
    static getSensors(state: SensorStateModel): SensorDetailsDto[]{
      return state.sensors;
    }

    @Selector()
    static getSensorWithDetails(state: SensorStateModel): SensorDetailsDto[]{
      return state.sensorWithDetails;
    }
    
    @Selector()
    static getLastCreatedSensor(state: SensorStateModel): SensorDetailsDto{
      return state.lastCreatedSensor;
    }

    @Selector()
    static getLastUpdatedSensor(state: SensorStateModel): SensorDetailsDto{
      return state.lastUpdatedSensor;
    }

    @Selector()
    static getSensorTotalCount(state: SensorStateModel): number{
        return state.sensorsTotalCount;
    }

    @Selector()
    static getSensorWithDetailsTotalCount(state: SensorStateModel): number{
        return state.sensorWithDetailsTotalCount;
    }

    @Action(GetAllSensor)
    getAllSensor(ctx: StateContext<SensorStateModel>, action: GetAllSensor){
        return this.sensorService.getAll(action.payload).pipe(tap(data => {
            ctx.patchState({
                sensorsTotalCount : data.totalCount,
                sensors : data.items
            });
        }))
    }

    @Action(CreateSensor)
    createsensor(ctx: StateContext<SensorStateModel>, action: CreateSensor) {
        return this.sensorService.create(action.payload).pipe(tap(data => {   
            ctx.patchState({
                lastCreatedSensor : data
            });
        }));
    }

    @Action(EditSensor)
    editsensor(ctx: StateContext<SensorStateModel>, action: EditSensor) {
        return this.sensorService.update(action.payload).pipe(tap(data => {   
            ctx.patchState({
                lastUpdatedSensor : data
            });
        }));
    }

    @Action(DeleteSensor)
    deletesensor(ctx: StateContext<SensorStateModel>, action: DeleteSensor) {
        return this.sensorService.delete(action.payload).pipe(tap(data => {   
            ctx.patchState({
                
            });
        }));
    }

    @Action(GetAllSensorWithDetail)
    getAllSensorWithDetails(ctx: StateContext<SensorStateModel>, action: GetAllSensorWithDetail){
        return this.sensorService.getAllWithDetails(action.payload).pipe(tap(data => {   
            ctx.patchState({
                sensorWithDetailsTotalCount : data.totalCount,
                sensorWithDetails : data.items
            });
        }));
    }
}