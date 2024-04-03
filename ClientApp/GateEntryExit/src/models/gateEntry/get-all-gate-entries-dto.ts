import { GateEntryDto } from "./gate-entry-dto";

export class GetAllGateEntriesDto{
    totalCount : number = 0;
    items : GateEntryDto[] = [];
}