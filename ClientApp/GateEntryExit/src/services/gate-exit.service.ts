import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';
import { CreateGateExitDto } from '../models/gateExit/create-gate-exit-dto';
import { GetAllDto } from '../models/shared/get-all-dto';
import { GetAllGateExitsDto } from '../models/gateExit/get-all-gate-exits-dto';
import { GateExitDto } from '../models/gateExit/gate-exit-dto';

@Injectable({
  providedIn: 'root'
})
export class GateExitService {

  private createApiUrl = environment.apiUrl + '/api/gateExit/create';
  private updateApiUrl = environment.apiUrl + '/api/gateExit/edit';
  private deleteApiUrl = environment.apiUrl + '/api/gateExit/delete';
  private getApiUrl = '';
  private getAllApiUrl = environment.apiUrl + '/api/gateExit/getAll';

  constructor(private http : HttpClient) { }

  // GET request
  get(): Observable<any> {
    return this.http.get<any>(`${this.getApiUrl}`);
  }

  // POST request
  getAll(data : GetAllDto): Observable<GetAllGateExitsDto> {
    return this.http.post<any>(`${this.getAllApiUrl}`, data);
  }

  // POST request
  create(data: CreateGateExitDto): Observable<GateExitDto> {
    return this.http.post<any>(`${this.createApiUrl}`, data);
  }

  // POST request
  update(data: any): Observable<GateExitDto> {
    return this.http.post<any>(`${this.updateApiUrl}`, data);
  }

  // DELETE request
  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.deleteApiUrl}/${id}`);
  }
}
