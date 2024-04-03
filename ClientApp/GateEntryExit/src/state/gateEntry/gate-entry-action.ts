import { CreateGateEntryDto } from "../../models/gateEntry/create-gate-entry-dto";
import { UpdateGateEntryDto } from "../../models/gateEntry/update-gate-entry-dto";
import { GetAllDto } from "../../models/shared/get-all-dto";

export class CreateGateEntry {
    static readonly type = '[GateEntry] Create';    
    constructor(public payload: CreateGateEntryDto){}
}

export class EditGateEntry {
    static readonly type = '[GateEntry] Edit';    
    constructor(public payload: UpdateGateEntryDto){}
}

export class DeleteGateEntry {
    static readonly type = '[GateEntry] Delete';    
    constructor(public payload: string){}
}

export class GetAllGateEntry {
    static readonly type = '[GateEntry] GetAll';    
    constructor(public payload: GetAllDto){}
}