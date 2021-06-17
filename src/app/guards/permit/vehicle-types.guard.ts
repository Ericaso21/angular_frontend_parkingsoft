import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class VehicleTypesGuard implements CanActivate {
  constructor(private authenticationService: AuthenticationService) {}
  canActivate() {
    if (this.authenticationService.getViewPermits('Tipos de vehiculos')) {
      return true;
    } else {
      return false;
    }
  }
}
