import { SensorDetailsDto } from "./sensor-details-dto";

export class GetAllSensorsDto{
    totalCount : number = 0;
    items : SensorDetailsDto[] = [];
}