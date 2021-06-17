import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class RatesGuard implements CanActivate {
  constructor(private authenticationService: AuthenticationService) {}
  canActivate() {
    if (this.authenticationService.getViewPermits('Tarifas')) {
      return true;
    } else {
      return false;
    }
  }
}
