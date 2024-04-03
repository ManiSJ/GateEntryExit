import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';
import { CreateGateDto } from '../models/gate/create-gate-dto';
import { UpdateGateDto } from '../models/gate/update-gate-dto';
import { GetAllDto } from '../models/shared/get-all-dto';
import { GetAllGatesDto } from '../models/gate/get-all-gates-dto';
import { GateDto } from '../models/gate/gate-dto';

@Injectable({
  providedIn: 'root'
})
export class GateService {

  private createApiUrl = environment.apiUrl + '/api/gate/create';
  private updateApiUrl = environment.apiUrl + '/api/gate/edit';
  private deleteApiUrl = environment.apiUrl + '/api/gate/delete';
  private getApiUrl = '';
  private getAllApiUrl = environment.apiUrl + '/api/gate/getAll';
  private getAllByIdApiUrl = environment.apiUrl + '/api/gate/getAllById';

  constructor(private http : HttpClient) { }

  // GET request
  get(id: number): Observable<any> {
    return this.http.get<any>(`${this.getApiUrl}/${id}`);
  }

  // POST Request
  getAllById(data: string[]): Observable<GetAllGatesDto> {
    return this.http.post<any>(`${this.getAllByIdApiUrl}`, data);
  }
 
  // POST Request
  getAll(data: GetAllDto): Observable<GetAllGatesDto> {
    return this.http.post<any>(`${this.getAllApiUrl}`, data);
  }

  // POST request
  create(data: CreateGateDto): Observable<GateDto> {
    return this.http.post<any>(`${this.createApiUrl}`, data);
  }

  // POST request
  update(data: UpdateGateDto): Observable<GateDto> {
    return this.http.post<any>(`${this.updateApiUrl}`, data);
  }

  // DELETE request
  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.deleteApiUrl}/${id}`);
  }
}
