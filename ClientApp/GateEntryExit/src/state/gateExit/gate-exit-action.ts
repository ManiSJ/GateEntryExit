import { CreateGateExitDto } from "../../models/gateExit/create-gate-exit-dto";
import { UpdateGateExitDto } from "../../models/gateExit/update-gate-exit-dto";
import { GetAllDto } from "../../models/shared/get-all-dto";

export class CreateGateExit {
    static readonly type = '[GateExit] Create';    
    constructor(public payload: CreateGateExitDto){}
}

export class EditGateExit {
    static readonly type = '[GateExit] Edit';    
    constructor(public payload: UpdateGateExitDto){}
}

export class DeleteGateExit {
    static readonly type = '[GateExit] Delete';    
    constructor(public payload: string){}
}

export class GetAllGateExit {
    static readonly type = '[GateExit] GetAll';    
    constructor(public payload: GetAllDto){}
}