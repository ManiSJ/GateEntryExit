import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';
import { CreateGateEntryDto } from '../models/gateEntry/create-gate-entry-dto';
import { UpdateGateEntryDto } from '../models/gateEntry/update-gate-entry-dto';
import { GetAllDto } from '../models/shared/get-all-dto';
import { GetAllGateEntriesDto } from '../models/gateEntry/get-all-gate-entries-dto';
import { GateEntryDto } from '../models/gateEntry/gate-entry-dto';

@Injectable({
  providedIn: 'root'
})
export class GateEntryService {

  private createApiUrl = environment.apiUrl + '/api/gateEntry/create';
  private updateApiUrl = environment.apiUrl + '/api/gateEntry/edit';
  private deleteApiUrl = environment.apiUrl + '/api/gateEntry/delete';
  private getApiUrl = '';
  private getAllApiUrl = environment.apiUrl + '/api/gateEntry/getAll';

  constructor(private http : HttpClient) { }

  // GET request
  get(): Observable<any> {
    return this.http.get<any>(`${this.getApiUrl}`);
  }

  // POST request
  getAll(data : GetAllDto): Observable<GetAllGateEntriesDto> {
    return this.http.post<any>(`${this.getAllApiUrl}`, data);
  }

  // POST request
  create(data: CreateGateEntryDto): Observable<GateEntryDto> {
    return this.http.post<any>(`${this.createApiUrl}`, data);
  }

  // POST request
  update(data: UpdateGateEntryDto): Observable<GateEntryDto> {
    return this.http.post<any>(`${this.updateApiUrl}`, data);
  }

  // DELETE request
  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.deleteApiUrl}/${id}`);
  }
}
