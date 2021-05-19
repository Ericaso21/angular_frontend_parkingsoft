import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URI } from '../../environments/environment';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  //endpoint
  private API_URI = API_URI.url;

  constructor(private http: HttpClient) {}

  getUserProfile(token: string, email: string) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.get(`${this.API_URI}/user/profile/${email}`, {
      headers: headers,
    });
  }

  updateUserProfile(userProfile: any, document_number: string) {
    return this.http.put(
      `${this.API_URI}/user/updateProfile/${document_number}`,
      userProfile
    );
  }

  updateUserProfileImage(file: any, token: string, document_number: string) {
    let headers = new HttpHeaders({ 'x-token': token });
    let fileImage = new FormData();
    fileImage.append('File', file);
    return this.http.post(
      `${this.API_URI}/user/updateProfileImage/${document_number}`,
      fileImage,
      { headers: headers }
    );
  }

  getDocumentType(token: any) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.get(`${this.API_URI}/global/document_types`, {
      headers: headers,
    });
  }

  getRole(token: any) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.get(`${this.API_URI}/global/role`, { headers: headers });
  }

  getGender(token: any) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.get(`${this.API_URI}/global/genders`, {
      headers: headers,
    });
  }

  getUser(token: any) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.get(`${this.API_URI}/user/list`, { headers: headers });
  }

  getOne(token: any, document_number: string) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.get(`${this.API_URI}/user/getOne/${document_number}`, {
      headers: headers,
    });
  }

  saveUser(user: User) {
    return this.http.post(`${this.API_URI}/user/create`, user);
  }

  updateUser(document_number: string, user: User) {
    return this.http.put(
      `${this.API_URI}/user/update/${document_number}`,
      user
    );
  }

  deleteUser(token: any, document_number: string) {
    let headers = new HttpHeaders({ 'x-token': token });
    return this.http.delete(`${this.API_URI}/user/delete/${document_number}`, {
      headers: headers,
    });
  }
}
