import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URI } from 'src/environments/environment';
import { Ticket } from '../interfaces/ticket';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private API_URI = API_URI.url;
  constructor(private http: HttpClient) {}

  getBlocks(token: any) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.get(`${this.API_URI}/global/blocks`, { headers: headers });
  }

  getBlocksClose(token: any) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.get(`${this.API_URI}/global/blockClose`, {
      headers: headers,
    });
  }

  getVehicles(token: any) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.get(`${this.API_URI}/global/vehicle`, {
      headers: headers,
    });
  }

  getOnePDF(token: any, id: string) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.get(`${this.API_URI}/tickets/getOnePDF/${id}`, {
      headers: headers,
    });
  }

  getTickets(token: any) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.get(`${this.API_URI}/tickets/list`, { headers: headers });
  }

  getTicket(token: any, id: string) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.get(`${this.API_URI}/tickets/getOne/${id}`, {
      headers: headers,
    });
  }

  saveTicket(ticket: Ticket) {
    return this.http.post(`${this.API_URI}/tickets/create`, ticket);
  }

  updateTicket(id: string | number, ticket: Ticket) {
    return this.http.put(`${this.API_URI}/tickets/update/${id}`, ticket);
  }

  deleteTicket(token: any, id: string) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.delete(`${this.API_URI}/tickets/delete/${id}`, {
      headers: headers,
    });
  }
}
