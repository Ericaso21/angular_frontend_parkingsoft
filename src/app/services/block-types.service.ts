import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URI } from 'src/environments/environment.prod';
import { BlockTypes } from '../interfaces/block-types';

@Injectable({
  providedIn: 'root'
})
export class BlockTypesService {
  private API_URI = API_URI.url;
  constructor(private http: HttpClient) { }


  getBlockTypes(token: any) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.get(`${this.API_URI}/blockTypes/list`, { 'headers': headers });
  }

  getBlockType(token:any, id: string){
    let headers = new HttpHeaders({'x-token': token});
    return this.http.get(`${this.API_URI}/blockTypes/getOne/${id}`,{'headers':headers});
  }

  saveBlockType(blockTypes:BlockTypes){
    return this.http.post(`${this.API_URI}/blockTypes/create`, blockTypes);
  }

  updateBlockType(id: string | number, blockType: BlockTypes){
    return this.http.put(`${this.API_URI}/blockTypes/update/${id}`,blockType);
  }

  deleteBlockType(token:any, id:string){
    let headers= new HttpHeaders({'x-token' :token });
    return this.http.delete(`${this.API_URI}/blockTypes/delete/${id}`,{'headers':headers});
  }

}
