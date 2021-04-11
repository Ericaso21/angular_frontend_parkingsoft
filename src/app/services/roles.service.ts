import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URI } from 'src/environments/environment.prod';
import { Roles } from '../interfaces/roles';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private API_URI = API_URI.url;
  constructor(private http: HttpClient) { }

  getRoles(token: any) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.get(`${this.API_URI}/roles/list`, { 'headers': headers });
  }

  getRole(token: any, id: string) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.get(`${this.API_URI}/roles/getOne/${id}`, { 'headers': headers });
  }

  saveRole(role: Roles) {
    return this.http.post(`${this.API_URI}/roles/create`, role);
  }

  updateRole(id: string | number, role: Roles) {
    return this.http.put(`${this.API_URI}/roles/update/${id}`, role);
  }

  deleteRole(token: any, id: string) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.delete(`${this.API_URI}/roles/delete/${id}`, { 'headers': headers });
  }
}
