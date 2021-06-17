import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URI } from 'src/environments/environment';
import { AccessPermits } from '../interfaces/access-permits';

@Injectable({
  providedIn: 'root',
})
export class AcessPermitsService {
  private API_URI = API_URI.url;
  constructor(private http: HttpClient) {}

  getModule(token: any) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.get(`${this.API_URI}/global/modules`, {
      headers: headers,
    });
  }

  getAccessPermits(token: any) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.get(`${this.API_URI}/accessPermits/list`, {
      headers: headers,
    });
  }

  getAcessPermit(token: any, id: string) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.get(`${this.API_URI}/accessPermits/getOne/${id}`, {
      headers: headers,
    });
  }

  saveAccessPermit(accessPermit: AccessPermits) {
    return this.http.post(`${this.API_URI}/accessPermits/create`, accessPermit);
  }

  updateAccessPermit(id: string | number, accessPermit: AccessPermits) {
    return this.http.put(
      `${this.API_URI}/accessPermits/update/${id}`,
      accessPermit
    );
  }

  deleteAccessPermit(token: any, id: string) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.delete(`${this.API_URI}/accessPermits/delete/${id}`, {
      headers: headers,
    });
  }
}
