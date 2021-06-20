import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URI } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private API_URI = API_URI.url;
  constructor(private http: HttpClient) {}

  getReport(token: any) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.get(`${this.API_URI}/reports/list`, { headers: headers });
  }

  filerData(filter: any) {
    return this.http.post(`${this.API_URI}/reports/filter`, filter);
  }
}
