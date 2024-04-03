import { CreateGateDto } from "../../models/gate/create-gate-dto";
import { UpdateGateDto } from "../../models/gate/update-gate-dto";
import { GetAllDto } from "../../models/shared/get-all-dto";

export class CreateGate {
    static readonly type = '[Gate] Create';    
    constructor(public payload: CreateGateDto){}
}

export class EditGate {
    static readonly type = '[Gate] Edit';    
    constructor(public payload: UpdateGateDto){}
}

export class DeleteGate {
    static readonly type = '[Gate] Delete';    
    constructor(public payload: string){}
}

export class GetAllGate {
    static readonly type = '[Gate] GetAll';    
    constructor(public payload: GetAllDto){}
}

export class GetAllGateById {
    static readonly type = '[Gate] GetAllById';    
    constructor(public payload: string[]){}
}