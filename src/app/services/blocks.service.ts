import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URI } from 'src/environments/environment.prod';
import { Blocks } from '../interfaces/blocks';

@Injectable({
  providedIn: 'root'
})
export class BlocksService {
  private API_URI = API_URI.url;
  constructor(private http: HttpClient) { }

  getBlockType(token: any) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.get(`${this.API_URI}/global/blockTypes`, { 'headers': headers });
  }

  getBlocks(token: any) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.get(`${this.API_URI}/block/list`, { 'headers': headers });
  }

  getBlock(token: any, id: string) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.get(`${this.API_URI}/block/getOne/${id}`, { 'headers': headers });
  }

  saveBlock(block: Blocks) {
    return this.http.post(`${this.API_URI}/block/create`, block);
  }

  updateBlock(block: Blocks, id: number | string) {
    return this.http.put(`${this.API_URI}/block/update/${id}`, block);
  }

  deleteBlock(token: any, id: string) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.delete(`${this.API_URI}/block/delete/${id}`, { 'headers': headers });
  }
}
