import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Subject } from 'rxjs';
import { AccessPermits } from 'src/app/interfaces/access-permits';
import { AcessPermitsService } from 'src/app/services/acess-permits.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-acess-permit',
  templateUrl: './acess-permit.component.html',
  styles: [],
})
export class AcessPermitComponent implements AfterViewInit, OnDestroy, OnInit {
  //dataTable configuraciones
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  // variable que guarda los datos
  accessPermits: any;
  roles: any;
  modules: any;
  dtTrigger: Subject<any> = new Subject<any>();

  //definicion NgModel

  accessPermit: AccessPermits | any = {
    token: '',
    id_access_permits: 0,
    fk_id_roles: 0,
    fk_id_modules: 0,
    view_modules: 0,
    create_modules: 0,
    edit_modules: 0,
    delete_modules: 0,
    created_att: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
    updated_att: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
  };

  //modal actualizar
  edit: boolean = false;
  //open modal
  submitted: boolean = false;

  //permit
  _create: any;
  _edit: any;
  _delete: any;

  constructor(
    private accessPermitService: AcessPermitsService,
    private userService: UserService,
    private recaptchaV3Service: ReCaptchaV3Service,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private authenticationService: AuthenticationService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  getCreatePermits() {
    this._create = this.authenticationService.getCreatePermits('Permisos');
  }

  getEditPermits() {
    this._edit = this.authenticationService.getEditPermits('Permisos');
  }

  getDeletePermits() {
    this._delete = this.authenticationService.getdeletePermits('Permisos');
  }

  open(content: any) {
    this.modalService.open(content);
  }

  close() {
    document.getElementById('closeModal')?.click();
    this.accessPermit = {
      token: '',
      id_access_permits: 0,
      fk_id_roles: 0,
      fk_id_modules: 0,
      view_modules: 0,
      create_modules: 0,
      edit_modules: 0,
      delete_modules: 0,
      created_att: new Date(),
      updated_att: new Date(),
    };
  }

  ngOnInit(): void {
    this.getRoles();
    this.getModules();
    this.getCreatePermits();
    this.getEditPermits();
    this.getDeletePermits();
    this.dtOptions = {
      responsive: true,
      processing: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.22/i18n/Spanish.json',
      },
      destroy: true,
      autoWidth: true,
      order: [2, 'asc'],
    };
  }

  ngAfterViewInit(): void {
    this.recaptchaV3Service.execute('action').subscribe(
      (token) => {
        this.getAccessPermits(token);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      this.recaptchaV3Service.execute('action').subscribe(
        (token) => {
          this.getAccessPermits(token);
        },
        (err) => {
          console.log(err);
        }
      );
      dtInstance.destroy();
    });
  }

  getRoles() {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.userService.getRole(token).subscribe(
        (res: any) => {
          this.roles = res;
        },
        (error: any) => {
          console.log(error);
        }
      );
    });
  }

  getModules() {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.accessPermitService.getModule(token).subscribe(
        (res: any) => {
          this.modules = res;
        },
        (error: any) => {
          console.log(error);
        }
      );
    });
  }

  getAccessPermits(token: any) {
    this.accessPermitService.getAccessPermits(token).subscribe(
      (res: any) => {
        this.accessPermits = res;
        this.dtTrigger.next();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getAccessPermit(id: string) {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.accessPermitService.getAcessPermit(token, id).subscribe(
        (res: any) => {
          if (res['view_modules'] == 1) {
            res['view_modules'] = true;
          } else {
            res['view_modules'] = false;
          }
          if (res['create_modules'] == 1) {
            res['create_modules'] = true;
          } else {
            res['create_modules'] = false;
          }
          if (res['edit_modules'] == 1) {
            res['edit_modules'] = true;
          } else {
            res['edit_modules'] = false;
          }
          if (res['delete_modules'] == 1) {
            res['delete_modules'] = true;
          } else {
            res['delete_modules'] = false;
          }
          this.accessPermit = res;
          this.edit = true;
        },
        (error: any) => {
          console.log(error);
        }
      );
    });
  }

  saveAccessPermit() {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      if (
        this.accessPermit.fk_id_roles == 0 ||
        this.accessPermit.fk_id_modules == 0
      ) {
        Swal.fire('Atención', 'Todos los campos son obligarios', 'error');
      } else {
        this.accessPermit.token = token;
        if (this.accessPermit.view_modules) {
          this.accessPermit.view_modules = '1';
        } else {
          this.accessPermit.view_modules = '2';
        }
        if (this.accessPermit.create_modules) {
          this.accessPermit.create_modules = '1';
        } else {
          this.accessPermit.create_modules = '2';
        }
        if (this.accessPermit.edit_modules) {
          this.accessPermit.edit_modules = '1';
        } else {
          this.accessPermit.edit_modules = '2';
        }
        if (this.accessPermit.delete_modules) {
          this.accessPermit.delete_modules = '1';
        } else {
          this.accessPermit.delete_modules = '2';
        }
        delete this.accessPermit.id_access_permits;
        delete this.accessPermit.updated_att;
        this.accessPermitService.saveAccessPermit(this.accessPermit).subscribe(
          (res: any) => {
            if (res['status']) {
              Swal.fire('¡Permiso!', res['message'], 'success');
              this.rerender();
              this.close();
            }
          },
          (error: any) => {
            if (error['status'] == 404) {
              Swal.fire('¡Error!', error['error']['message'], 'error');
            }
          }
        );
      }
    });
  }

  updateAccessPermit() {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.accessPermit.token = token;
      if (this.accessPermit.view_modules) {
        this.accessPermit.view_modules = '1';
      } else {
        this.accessPermit.view_modules = '2';
      }
      if (this.accessPermit.create_modules) {
        this.accessPermit.create_modules = '1';
      } else {
        this.accessPermit.create_modules = '2';
      }
      if (this.accessPermit.edit_modules) {
        this.accessPermit.edit_modules = '1';
      } else {
        this.accessPermit.edit_modules = '2';
      }
      if (this.accessPermit.delete_modules) {
        this.accessPermit.delete_modules = '1';
      } else {
        this.accessPermit.delete_modules = '2';
      }
      delete this.accessPermit.created_att;
      this.accessPermitService
        .updateAccessPermit(
          this.accessPermit.id_access_permits,
          this.accessPermit
        )
        .subscribe(
          (res: any) => {
            if (res['status']) {
              Swal.fire('¡Permiso!', res['message'], 'success');
              this.rerender();
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

  deleteAccessPermit(id: string) {
    Swal.fire({
      title: 'Estas Seguro',
      text: '¡No podras revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
    }).then((result) => {
      if (result.value) {
        this.recaptchaV3Service.execute('action').subscribe(
          (token) => {
            this.accessPermitService.deleteAccessPermit(token, id).subscribe(
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
            );
          },
          (error: any) => {
            console.log(error);
          }
        );
      }
    });
  }
}
