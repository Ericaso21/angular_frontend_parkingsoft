import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { API_URI } from 'src/environments/environment';
import { Authentication } from '../interfaces/authentication';
import { Register } from '../interfaces/register';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private API_URI = API_URI.url;
  private module: any[] = [];
  private permits: any[] = [];
  private permit: any;
  constructor(private http: HttpClient, private router: Router) {}

  registerClient(client: Register) {
    return this.http.post(`${this.API_URI}/authentication/create`, client);
  }

  authentication(authentication: Authentication) {
    return this.http.post(
      `${this.API_URI}/authentication/user/authentication`,
      authentication
    );
  }

  public get logIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getPermits() {
    this.permit = localStorage.getItem(`permit`);
    let permit = JSON.parse(this.permit);
    return permit;
  }

  getViewPermits(viewName: string) {
    this.permits = this.getPermits();
    for (let i = 0; i < this.permits.length; i++) {
      if (
        this.permits[i]['name_modules'] == viewName &&
        this.permits[i]['view_modules'] == 1
      ) {
        if (this.permits[i]['name_modules'] == viewName) {
          return true;
        }
      } else {
        if (this.permits[i]['name_modules'] == viewName) {
          return false;
        }
      }
    }
  }

  getCreatePermits(viewName: string) {
    this.permits = this.getPermits();
    for (let i = 0; i < this.permits.length; i++) {
      if (
        this.permits[i]['name_modules'] == viewName &&
        this.permits[i]['create_modules'] == 1
      ) {
        if (this.permits[i]['name_modules'] == viewName) {
          return true;
        }
      } else {
        if (this.permits[i]['name_modules'] == viewName) {
          return false;
        }
      }
    }
  }

  getEditPermits(viewName: string) {
    this.permits = this.getPermits();
    for (let i = 0; i < this.permits.length; i++) {
      if (
        this.permits[i]['name_modules'] == viewName &&
        this.permits[i]['edit_modules'] == 1
      ) {
        if (this.permits[i]['name_modules'] == viewName) {
          return true;
        }
      } else {
        if (this.permits[i]['name_modules'] == viewName) {
          return false;
        }
      }
    }
  }

  getdeletePermits(viewName: string) {
    this.permits = this.getPermits();
    for (let i = 0; i < this.permits.length; i++) {
      if (
        this.permits[i]['name_modules'] == viewName &&
        this.permits[i]['delete_modules'] == 1
      ) {
        if (this.permits[i]['name_modules'] == viewName) {
          return true;
        }
      } else {
        if (this.permits[i]['name_modules'] == viewName) {
          return false;
        }
      }
    }
  }
}
