import { GateDetailsDto } from "../gate/gate-details-dto";

export class SensorDetailsDto{
    id : string = '';
    name : string = '';
    gateDetails : GateDetailsDto = new GateDetailsDto();
}