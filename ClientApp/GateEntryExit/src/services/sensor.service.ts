import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';
import { CreateSensorDto } from '../models/sensor/create-sensor-dto';
import { GetAllSensorWithDetailsInputDto } from '../models/sensor/get-all-sensor-with-details-input-dto';
import { UpdateSensorDto } from '../models/sensor/update-sensor-dto';
import { GetAllDto } from '../models/shared/get-all-dto';
import { GetAllSensorsDto } from '../models/sensor/get-all-sensors-dto';
import { SensorDetailsDto } from '../models/sensor/sensor-details-dto';
import { GetAllSensorWithDetailsReportInputDto } from '../models/sensor/get-all-sensor-with-details-excel-input-dto';

@Injectable({
  providedIn: 'root'
})
export class SensorService {

  private createApiUrl = environment.apiUrl + '/api/sensor/create';
  private updateApiUrl = environment.apiUrl + '/api/sensor/edit';
  private deleteApiUrl = environment.apiUrl + '/api/sensor/delete';
  private getApiUrl = '';
  private getAllApiUrl = environment.apiUrl + '/api/sensor/getAll';
  private getAllWithDetailsApiUrl = environment.apiUrl + '/api/sensor/getAllWithDetails';
  private getAllWithDetailsApiUrlExcelReport = environment.apiUrl + '/api/sensor/getAllWithDetailsExcelReport';
  private getAllWithDetailsApiUrlPdfReport = environment.apiUrl + '/api/sensor/getAllWithDetailsPdfReport';

  constructor(private http : HttpClient) { }

  // GET request
  get(id: number): Observable<any> {
    return this.http.get<any>(`${this.getApiUrl}/${id}`);
  }

  // POST request
  getAll(data : GetAllDto): Observable<GetAllSensorsDto> {
    return this.http.post<any>(`${this.getAllApiUrl}`, data);
  }

   // POST request
  getAllWithDetails(data: GetAllSensorWithDetailsInputDto): Observable<any> {
    return this.http.post<any>(`${this.getAllWithDetailsApiUrl}`, data);
  }

  // POST request
  getAllWithDetailsExcelReport(data: GetAllSensorWithDetailsReportInputDto): Observable<any> {
    return this.http.post<any>(`${this.getAllWithDetailsApiUrlExcelReport}`, data);
  }

  // POST request
  getAllWithDetailsPdfReport(data: GetAllSensorWithDetailsReportInputDto): Observable<any> {
    return this.http.post<any>(`${this.getAllWithDetailsApiUrlPdfReport}`, data);
  }

  // POST request
  create(data: CreateSensorDto): Observable<SensorDetailsDto> {
    return this.http.post<any>(`${this.createApiUrl}`, data);
  }

  // POST request
  update(data: UpdateSensorDto): Observable<SensorDetailsDto> {
    return this.http.post<any>(`${this.updateApiUrl}`, data);
  }

  // DELETE request
  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.deleteApiUrl}/${id}`);
  }
}
