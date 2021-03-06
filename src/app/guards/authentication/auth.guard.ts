import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}
  canActivate() {
    if (this.authenticationService.logIn) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
