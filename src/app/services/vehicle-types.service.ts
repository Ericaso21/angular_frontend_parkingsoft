import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URI } from 'src/environments/environment';
import { VehicleTypes } from '../interfaces/vehicle-types';

@Injectable({
  providedIn: 'root',
})
export class VehicleTypesService {
  private API_URI = API_URI.url;
  constructor(private http: HttpClient) {}

  getVehicleTypes(token: any) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.get(`${this.API_URI}/vehicleTypes/list`, {
      headers: headers,
    });
  }

  getVehicleType(token: any, id: string) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.get(`${this.API_URI}/vehicleTypes/getOne/${id}`, {
      headers: headers,
    });
  }

  saveVehicleType(vehicleTypes: VehicleTypes) {
    return this.http.post(`${this.API_URI}/vehicleTypes/create`, vehicleTypes);
  }

  updateVehicleType(id: string | number, vehicleTypes: VehicleTypes) {
    return this.http.put(
      `${this.API_URI}/vehicleTypes/update/${id}`,
      vehicleTypes
    );
  }

  deleteVehicleType(token: any, id: string) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.delete(`${this.API_URI}/vehicleTypes/delete/${id}`, {
      headers: headers,
    });
  }
}
