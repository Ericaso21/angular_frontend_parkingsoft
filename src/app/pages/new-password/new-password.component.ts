import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { AuthenticationService } from 'src/app/services/authentication.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styles: [],
})
export class NewPasswordComponent implements OnInit {
  configPassword: string = '';
  resetPassword: any = {
    token: '',
    email: '',
    newPassword: '',
  };

  constructor(
    private authenticationService: AuthenticationService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  resetPasswordUser() {
    this.resetPassword.email = this.activatedRoute.snapshot.params;
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.resetPassword.token = token;
      if (this.resetPassword.newPassword === this.configPassword) {
        this.authenticationService.newPassword(this.resetPassword).subscribe(
          (res: any) => {
            if (res['status']) {
              Swal.fire('¡Contraseña!', res['message'], 'success');
              this.router.navigate(['/login']);
            }
          },
          (error: any) => {
            console.log(error);
          }
        );
      } else {
        console.log('contraseñas no coinciden');
      }
    });
  }
}
