import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URI } from 'src/environments/environment.prod';
import { Vehicle } from '../interfaces/vehicle';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private API_URI = API_URI.url
  constructor(private http:HttpClient) { }

  getDocumentUser(token: any){
    let headers = new HttpHeaders ({'x-token':token});
    return this.http.get(`${this.API_URI}/global/user`, { 'headers': headers });
  }

  getVehicleType(token: any) {
    let headers = new HttpHeaders ({'x-token':token});
    return this.http.get(`${this.API_URI}/global/vehicleType`, { 'headers': headers });
  }

  getVehicles(token : any){
    let headers = new HttpHeaders ({'x-token':token});
    return this.http.get(`${this.API_URI}/vehicles/list`, { 'headers': headers });
  }

  getVehicle(token : any ,id:String){
    let headers = new HttpHeaders ({'x-token':token});
    return this.http.get(`${this.API_URI}/vehicles/getOne/${id}`, { 'headers': headers });
  }

  saveVehicle(vehicle : Vehicle){
    return this.http.post(`${this.API_URI}/vehicles/create`, vehicle)
  }

  updateVehicle(id: String | number, vehicle:Vehicle){
    return this.http.put(`${this.API_URI}/vehicles/update/${id}`, vehicle)
  }

  deleteVehicle(token: any ,id:String){
    let headers = new HttpHeaders ({'x-token':token});
    return this.http.delete(`${this.API_URI}/vehicles/delete/${id}`, {'headers' : headers})
  }

}
