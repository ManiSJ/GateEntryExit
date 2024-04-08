import { GetAllDto } from "../shared/get-all-dto";

export class GetAllSensorWithDetailsInputDto extends GetAllDto{
    gateIds : string[] = [];
    fromDate : string | null = null;
    toDate : string | null = null;
}