import { CreateSensorDto } from "../../models/sensor/create-sensor-dto";
import { GetAllSensorWithDetailsReportInputDto } from "../../models/sensor/get-all-sensor-with-details-excel-input-dto";
import { GetAllSensorWithDetailsInputDto } from "../../models/sensor/get-all-sensor-with-details-input-dto";
import { UpdateSensorDto } from "../../models/sensor/update-sensor-dto";
import { GetAllDto } from "../../models/shared/get-all-dto";

export class CreateSensor {
    static readonly type = '[Sensor] Create';    
    constructor(public payload: CreateSensorDto){}
}

export class EditSensor {
    static readonly type = '[Sensor] Edit';    
    constructor(public payload: UpdateSensorDto){}
}

export class DeleteSensor {
    static readonly type = '[Sensor] Delete';    
    constructor(public payload: string){}
}

export class GetAllSensor {
    static readonly type = '[Sensor] GetAll';    
    constructor(public payload: GetAllDto){}
}

export class GetAllSensorWithDetail {
    static readonly type = '[SensorWithDetails] GetAll';    
    constructor(public payload: GetAllSensorWithDetailsInputDto){}
}

export class GetAllSensorWithDetailExcelReport {
    static readonly type = '[SensorWithDetails] GetAllExcelReport';    
    constructor(public payload: GetAllSensorWithDetailsReportInputDto){}
}

export class GetAllSensorWithDetailPdfReport {
    static readonly type = '[SensorWithDetails] GetAllPdfReport';    
    constructor(public payload: GetAllSensorWithDetailsReportInputDto){}
}