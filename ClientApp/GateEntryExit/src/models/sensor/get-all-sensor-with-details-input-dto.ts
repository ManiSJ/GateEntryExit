import { GetAllDto } from "../shared/get-all-dto";

export class GetAllSensorWithDetailsInputDto extends GetAllDto{
    gateIds : string[] = [];
    from : string | null = null;
    to : string | null = null;
}