import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URI } from 'src/environments/environment.prod';
import { Rates } from '../interfaces/rates';

@Injectable({
  providedIn: 'root'
})
export class RatesService {
  private API_URI = API_URI.url
  constructor(private http: HttpClient) { }

  getRates(token: any){
    let headers = new HttpHeaders ({'x-token':token});
    return this.http.get(`${this.API_URI}/rates/list`, { 'headers': headers });
  }

  getRate(token: any, id:string){
    let headers = new HttpHeaders ({'x-token':token});
    return this.http.get(`${this.API_URI}/rates/getOne/${id}`, { 'headers': headers });
  }

  saveRates(rate: Rates){
    return this.http.post(`${this.API_URI}/rates/create`, rate);
  }

  updateRate(id: string | number, rate: Rates){
    return this.http.put(`${this.API_URI}/rates/update/${id}`, rate);
  }

  deleteRate(token: any, id:string){
    let headers = new HttpHeaders ({'x-token':token});
    return this.http.delete(`${this.API_URI}/rates/delete/${id}`, { 'headers': headers });
  }

  getVehicleType(token: any){
    let headers = new HttpHeaders ({'x-token':token});
    return this.http.get(`${this.API_URI}/global/vehicleType`, { 'headers': headers});
  }

}

