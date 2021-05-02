import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { API_URI } from 'src/environments/environment.prod';
import { Authentication } from '../interfaces/authentication';
import { Register } from '../interfaces/register';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private API_URI = API_URI.url;
  constructor(private http: HttpClient, private router: Router) { }

  registerClient(client: Register) {
    return this.http.post(`${this.API_URI}/authentication/create`, client);
  }

  authentication(authentication: Authentication) {
    return this.http.post(`${this.API_URI}/authentication/user/authentication`, authentication);
  }

  public get logIn(): boolean {
    return (localStorage.getItem('token') !== null);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
