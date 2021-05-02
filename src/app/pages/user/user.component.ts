import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Subject } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { EncriptService } from 'src/app/services/encript.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: [
  ]
})
export class UserComponent implements AfterViewInit, OnDestroy, OnInit {

  //dataTable configuraciones
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  // variable que guarda los datos
  users: any;
  document_type: any;
  role: any;
  gender: any;
  dtTrigger: Subject<any> = new Subject<any>();

  //declarate NgModel
  user: User | any = {
    token: '',
    document_number: '',
    pk_fk_id_document_type: 0,
    pk_fk_id_roles: 0,
    roles_users_status: 0,
    fk_id_gender: 0,
    name_user: '',
    first_name: '',
    second_name: '',
    surname: '',
    second_surname: '',
    email: '',
    password_user: '',
    created_att: new Date(),
    updated_att: new Date()
  }

  //modal actualizar
  edit: boolean = false;
  //open modal
  submitted: boolean = false;

  constructor(private userService: UserService, private recaptchaV3Service: ReCaptchaV3Service, private encript: EncriptService, config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  open(content: any) {
    this.modalService.open(content, { size: 'xl' });
  }

  close() {
    document.getElementById('closeModal')?.click();
    this.user = {
      token: '',
      document_number: '',
      pk_fk_id_document_type: 0,
      pk_fk_id_roles: 0,
      roles_users_status: 0,
      fk_id_gender: 0,
      name_user: '',
      first_name: '',
      second_name: '',
      surname: '',
      second_surname: '',
      email: '',
      password_user: '',
      created_att: new Date(),
      updated_att: new Date()
    }
  }

  ngOnInit(): void {
    this.dtOptions = {
      processing: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.22/i18n/Spanish.json"
      },
      destroy: true,
      autoWidth: true,
      order: [1, 'asc'],
      responsive: true
    };
    this.getDocumentType();
    this.getRole();
    this.getGenders();
  }

  ngAfterViewInit(): void {
    this.recaptchaV3Service.execute('action').subscribe(
      (token) => {
        this.getUser(token);
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      this.recaptchaV3Service.execute('action').subscribe(
        (token) => {
          this.getUser(token);
        },
        (err) => {
          console.log(err);
        }
      )
      dtInstance.destroy();
    })
  }

  getUser(token: any) {
    this.userService.getUser(token).subscribe(
      (res: any) => {
        this.users = res;
        this.dtTrigger.next();
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  getOne(document_number: string) {
    this.recaptchaV3Service.execute('action').subscribe(
      (token) => {
        this.userService.getOne(token, document_number).subscribe(
          (res: any) => {
            this.user = res;
            this.edit = true;
          },
          (error: any) => {
            console.log(error)
          }
        )
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  getDocumentType() {
    this.recaptchaV3Service.execute('action').subscribe(
      (token) => {
        this.userService.getDocumentType(token).subscribe(
          (res: any) => {
            this.document_type = res;
          },
          (error: any) => {
            console.log(error)
          }
        )
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  getRole() {
    this.recaptchaV3Service.execute('action').subscribe(
      (token) => {
        this.userService.getRole(token).subscribe(
          (res: any) => {
            this.role = res;
          },
          (error: any) => {
            console.log(error)
          }
        )
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  getGenders() {
    this.recaptchaV3Service.execute('action').subscribe(
      (token) => {
        this.userService.getGender(token).subscribe(
          (res: any) => {
            this.gender = res;
            this.edit = true;
          },
          (error: any) => {
            console.log(error)
          }
        )
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  saveUser() {
    this.recaptchaV3Service.execute('action').subscribe(
      (token) => {
        this.user.token = token;
        if (this.user.document_number == '' || this.user.pk_fk_id_document_type == 0 || this.user.fk_id_gender == 0 || this.user.first_name == '' || this.user.surname == '' || this.user.email == '' || this.user.password_user == '') {
          Swal.fire('Atención', 'Todos los campos son obligarios', 'error')
        } else {
          delete this.user.updated_att;
          if (this.user.first_name.split(' ')[1] == undefined) {
            delete this.user.second_name;
          } else {
            this.user.second_name = this.user.first_name.split(' ')[1];
          }
          if (this.user.surname.split(' ')[1] == undefined) {
            delete this.user.second_surname;
          } else {
            this.user.second_surname = this.user.surname.split(' ')[1];
          }
          this.user.first_name = this.user.first_name.split(' ')[0];
          this.user.surname = this.user.surname.split(' ')[0];
          this.user.password_user = this.encript.set('123456$#@$^@1ERF', this.user.password_user);
          this.userService.saveUser(this.user).subscribe(
            (res: any) => {
              if (res['status']) {
                Swal.fire('¡Usuario!', res['message'], 'success');
                this.rerender();
                this.close();
              }
            },
            (error: any) => {
              if (error['status'] == 404) {
                Swal.fire('Error', error['error']['message'], 'error');
                this.user.password_user = '';
              }
            }
          )
        }
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  updateUser() {
    this.recaptchaV3Service.execute('action').subscribe(
      (token) => {
        this.user.token = token;
        delete this.user.created_att;
        this.user.second_name = this.user.first_name.split(' ')[1];
        this.user.first_name = this.user.first_name.split(' ')[0];
        this.user.second_surname = this.user.surname.split(' ')[1];
        this.user.surname = this.user.surname.split(' ')[0];
        if (this.user.password_user == '') {
          delete this.user.password_user;
        } else if (this.user.password_user != undefined) {
          this.user.password_user = this.encript.set('123456$#@$^@1ERF', this.user.password_user);
        }
        this.userService.updateUser(this.user.document_number, this.user).subscribe(
          (res: any) => {
            if (res['status']) {
              Swal.fire('¡Usuario!', res['message'], 'success');
              this.rerender();
              this.close();
              this.edit = false;
            }
          },
          (error: any) => {
            if (error['status'] == 404) {
              Swal.fire('Error', error['error']['message'], 'error');
              this.user.password_user = '';
            }
          }
        )
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  deleteUser(document_number: string) {
    Swal.fire({
      title: 'Estas Seguro',
      text: '¡No podras revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar'
    }).then(result => {
      if (result.value) {
        this.recaptchaV3Service.execute('action').subscribe(
          (token) => {
            console.log(token)
            this.userService.deleteUser(token, document_number).subscribe(
              (res: any) => {
                if (res['status']) {
                  Swal.fire('Eliminado', res['message'], 'success');
                  this.rerender();
                  this.edit = false;
                }
              },
              (error: any) => {
                if (error['status'] == 404) {
                  Swal.fire('¡Error!', error['error']['message'], 'error');
                }
              }
            )
          },
          (error: any) => {
            console.log(error)
          }
        )
      }
    })
  }

}
