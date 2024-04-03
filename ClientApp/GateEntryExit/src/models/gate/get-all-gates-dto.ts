import { GateDetailsDto } from "./gate-details-dto";

export class GetAllGatesDto{
    totalCount : number = 0;
    items : GateDetailsDto[] = [];
}