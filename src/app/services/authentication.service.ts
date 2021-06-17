import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { API_URI } from 'src/environments/environment';
import { Authentication } from '../interfaces/authentication';
import { Register } from '../interfaces/register';
import { EncriptService } from './encript.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private API_URI = API_URI.url;
  private module: any[] = [];
  userData: any;
  private permits: any[] = [];
  private permit: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private encript: EncriptService
  ) {}

  getUserData() {
    this.userData = localStorage.getItem('userData');
    let userData = decodeURIComponent(this.userData);
    return JSON.parse(userData);
  }

  getUserDataPost(data: any) {
    return this.http.post(`${this.API_URI}/user/userData`, data);
  }

  resetPassword(emailPasswordUser: any) {
    return this.http.put(
      `${this.API_URI}/authentication/userResetPassword`,
      emailPasswordUser
    );
  }

  newPassword(newPassword: any) {
    newPassword.newPassword = this.encript.set(
      '123456$#@$^@1ERF',
      newPassword.newPassword
    );
    return this.http.put(
      `${this.API_URI}/authentication/newPassword`,
      newPassword
    );
  }

  registerClient(client: Register) {
    return this.http.post(`${this.API_URI}/authentication/create`, client);
  }

  authentication(authentication: Authentication) {
    authentication.password_user = this.encript.set(
      '123456$#@$^@1ERF',
      authentication.password_user
    );
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
    document.cookie = 'permit=' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    this.router.navigate(['/login']);
  }

  getPermits() {
    this.permit = this.readCookie('permit');
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

  readCookie(name: any) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');

    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }

    return null;
  }
}
