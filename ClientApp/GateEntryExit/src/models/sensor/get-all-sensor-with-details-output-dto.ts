import { SensorDetailsDto } from "./sensor-details-dto";

export class GetAllSensorWithDetailsOutputDto{
    totalCount : number = 0;
    items : SensorDetailsDto[] = [];
}