import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Settlement } from '../models/settlement.model';

@Injectable({
  providedIn: 'root'
})
export class SettlementsService {

  private baseUrl = `${environment.apiUrl}/settlements`;

  constructor(private http: HttpClient) {}

  getSettlements(): Observable<Settlement[]> {
    return this.http.get<Settlement[]>(this.baseUrl);
  }

  getByGroup(groupId: number): Observable<Settlement[]> {
    const params = new HttpParams().set('groupId', groupId);
    return this.http.get<Settlement[]>(this.baseUrl, { params });
  }

  createSettlement(payload: Partial<Settlement>): Observable<Settlement> {
    return this.http.post<Settlement>(this.baseUrl, payload);
  }

  updateSettlement(payload: Settlement): Observable<Settlement> {
    return this.http.put<Settlement>(`${this.baseUrl}/${payload.id}`, payload);
  }

  deleteSettlement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
