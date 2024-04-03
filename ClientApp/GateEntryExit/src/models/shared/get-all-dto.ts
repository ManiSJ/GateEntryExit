export class GetAllDto{
    maxResultCount : number = 0;
    skipCount : number = 0;
    sorting : string = '';
    
    constructor(data: Partial<GetAllDto>) {
        Object.assign(this, data);
    }
}