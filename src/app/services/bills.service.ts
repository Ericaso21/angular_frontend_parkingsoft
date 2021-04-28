import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URI } from 'src/environments/environment.prod';
import { Bill } from '../interfaces/bill';

@Injectable({
  providedIn: 'root'
})
export class BillsService {
  private API_URI = API_URI.url;
  constructor(private http: HttpClient) { }

  getTicket(token: any, id: string) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.get(`${this.API_URI}/bill/ticket/${id}`, { 'headers': headers });
  }

  getBill(token: any) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.get(`${this.API_URI}/bill/list`, { 'headers': headers });
  }

  saveBill(bill: Bill) {
    return this.http.post(`${this.API_URI}/bill/create`, bill)
  }

  deleteBill(token: any, id: string) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.delete(`${this.API_URI}/bill/delete/${id}`, { 'headers': headers });
  }
}
