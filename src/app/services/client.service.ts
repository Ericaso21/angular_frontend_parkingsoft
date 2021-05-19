import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URI } from 'src/environments/environment';
import { Client } from '../interfaces/client';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private API_URI = API_URI.url;
  constructor(private http: HttpClient) {}

  getVehicle(email: any, token: string) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.post(`${this.API_URI}/client/vehicles`, email, {
      headers: headers,
    });
  }

  getVehicleUser(plate_vehicle: string, token: string) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.get(
      `${this.API_URI}/client/plateVehicle/${plate_vehicle}`,
      { headers: headers }
    );
  }

  update(plate_vehicle: string, clientUser: Client) {
    return this.http.put(
      `${this.API_URI}/client/updateVehicle/${plate_vehicle}`,
      clientUser
    );
  }

  updateFileImageVehicle(file: any, vehicle_plate: string, token: string) {
    let headers = new HttpHeaders({ 'x-token': token });
    let fileImage = new FormData();
    fileImage.append('File', file);
    return this.http.post(
      `${this.API_URI}/client/updateImageVehicle/${vehicle_plate}`,
      fileImage,
      { headers: headers }
    );
  }
}
