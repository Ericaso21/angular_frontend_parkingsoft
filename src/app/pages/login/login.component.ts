import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Authentication } from 'src/app/interfaces/authentication';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { EncriptService } from 'src/app/services/encript.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnDestroy, OnInit {
  //ngModel
  userAuthentication: Authentication | any = {
    token: '',
    email: '',
    password_user: '',
  };

  constructor(
    private authenticationService: AuthenticationService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private encript: EncriptService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  ngOnDestroy() {}

  authentication() {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.userAuthentication.token = token;
      this.userAuthentication.password_user = this.encript.set(
        '123456$#@$^@1ERF',
        this.userAuthentication.password_user
      );
      this.authenticationService
        .authentication(this.userAuthentication)
        .subscribe(
          (res: any) => {
            let times = {
              value: res['token'],
              timestamp: new Date().getTime(),
            };
            let user = {
              userName: btoa(res['singend_user']['first_name']),
              surname: btoa(res['singend_user']['surname']),
            };
            let role = { email: btoa(res['singend_user']['email']) };
            let permit = res['permit'];
            localStorage.setItem('permit', JSON.stringify(permit));
            localStorage.setItem('token', JSON.stringify(times));
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('role', JSON.stringify(role));
            this.router.navigate(['/dashboard']);
          },
          (error: any) => {
            if (error['status'] == 404) {
              Swal.fire('!Error!', error['error']['message'], 'error');
              this.userAuthentication.password_user = '';
            }
          }
        );
    });
  }
}
