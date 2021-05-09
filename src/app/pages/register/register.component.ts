import { Component, OnInit } from '@angular/core';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Register } from 'src/app/interfaces/register';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { EncriptService } from 'src/app/services/encript.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [],
})
export class RegisterComponent implements OnInit {
  //variables save data
  document_type: any;
  genders: any;

  //ngModel configutes
  client: Register | any = {
    token: '',
    document_number: '',
    pk_fk_id_document_type: 0,
    fk_id_gender: 0,
    name_user: '',
    first_name: '',
    second_name: '',
    surname: '',
    second_surname: '',
    email: '',
    password_user: '',
    created_att: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
  };

  constructor(
    private encript: EncriptService,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {}

  ngOnInit(): void {
    this.getGenders();
    this.document_types();
  }

  document_types() {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.userService.getDocumentType(token).subscribe(
        (res: any) => {
          this.document_type = res;
        },
        (error: any) => {
          console.log(error);
        }
      );
    });
  }

  getGenders() {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.userService.getGender(token).subscribe(
        (res: any) => {
          this.genders = res;
        },
        (error: any) => {
          console.log(error);
        }
      );
    });
  }

  registerUser() {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.client.token = token;
      if (
        this.client.document_number == '' ||
        this.client.pk_fk_id_document_type == 0 ||
        this.client.fk_id_gender == 0 ||
        this.client.first_name == '' ||
        this.client.surname == '' ||
        this.client.email == '' ||
        this.client.password_user == ''
      ) {
        Swal.fire('Atención', 'Todos los campos son obligarios', 'error');
      } else {
        if (this.client.first_name.split(' ')[1] == undefined) {
          delete this.client.second_name;
        } else {
          this.client.second_name = this.client.first_name.split(' ')[1];
        }
        if (this.client.surname.split(' ')[1] == undefined) {
          delete this.client.second_surname;
        } else {
          this.client.second_surname = this.client.surname.split(' ')[1];
        }
        this.client.first_name = this.client.first_name.split(' ')[0];
        this.client.surname = this.client.surname.split(' ')[0];
        this.client.password_user = this.encript.set(
          '123456$#@$^@1ERF',
          this.client.password_user
        );
        this.authenticationService.registerClient(this.client).subscribe(
          (res: any) => {
            if (res['status']) {
              Swal.fire('¡Usuario!', res['message'], 'success');
              this.client = {
                token: '',
                document_number: '',
                pk_fk_id_document_type: 0,
                fk_id_gender: 0,
                name_user: '',
                first_name: '',
                second_name: '',
                surname: '',
                second_surname: '',
                email: '',
                password_user: '',
                created_att: new Date(),
              };
            }
          },
          (error: any) => {
            if (error['status'] == 404) {
              Swal.fire('Error', error['error']['message'], 'error');
              this.client.password_user = '';
            }
          }
        );
      }
    });
  }
}
