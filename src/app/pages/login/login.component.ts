import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Authentication } from 'src/app/interfaces/authentication';
import { AuthenticationService } from 'src/app/services/authentication.service';
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

  emailPasswordReset: any = {
    token: '',
    email: '',
  };

  //open modal
  submitted: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private router: Router,
    config: NgbModalConfig,
    private modalService: NgbModal
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {}

  ngOnDestroy() {}

  open(content: any) {
    this.modalService.open(content);
  }

  close() {
    document.getElementById('closeModal')?.click();
  }

  resetPassword() {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.emailPasswordReset.token = token;
      this.authenticationService
        .resetPassword(this.emailPasswordReset)
        .subscribe(
          (res: any) => {
            if (res['status']) {
              Swal.fire('¡Email!', res['message'], 'success');
              this.close();
            }
          },
          (error: any) => {
            if (error['status'] == 404) {
              Swal.fire('¡Error!', error['error']['message'], 'error');
            }
          }
        );
    });
  }

  authentication() {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.userAuthentication.token = token;
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
            let role = {};
            if (res['singend_user']['name_file'] === null) {
              role = { email: btoa(res['singend_user']['email']) };
            } else {
              role = {
                email: btoa(res['singend_user']['email']),
                image: btoa(res['singend_user']['name_file']),
              };
            }
            let permit = res['permit'];
            document.cookie =
              'permit=' + encodeURIComponent(JSON.stringify(permit));
            localStorage.setItem('token', JSON.stringify(times));
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('role', JSON.stringify(role));
            if (res['singend_user']['pk_fk_id_roles'] === 3) {
              this.router.navigate(['/client']);
            } else {
              this.router.navigate(['/dashboard']);
            }
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
