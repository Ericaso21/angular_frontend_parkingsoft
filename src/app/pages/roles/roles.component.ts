import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Subject } from 'rxjs';
import { Roles } from 'src/app/interfaces/roles';
import { RolesService } from 'src/app/services/roles.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styles: [
  ]
})
export class RolesComponent implements AfterViewInit, OnDestroy, OnInit {
  //dataTable configuraciones
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  // variable que guarda los datos
  roles: any;
  dtTrigger: Subject<any> = new Subject<any>();

  //definicion NgModel
  role: Roles | any = {
    token: '',
    id_roles: 0,
    name_role: '',
    description_role: '',
    role_status: 0,
    created_att: new Date(),
    updated_att: new Date()
  }

  //modal actualizar
  edit: boolean = false;
  //open modal
  submitted: boolean = false;

  constructor(private rolesService: RolesService, private recaptchaV3Service: ReCaptchaV3Service, config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  open(content: any) {
    this.modalService.open(content);
  }

  close() {
    document.getElementById('closeModal')?.click();
    this.role = {
      token: '',
      id_roles: 0,
      name_role: '',
      description_role: '',
      role_status: 0,
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
      order: [0, 'asc']
    };
  }

  ngAfterViewInit(): void {
    this.recaptchaV3Service.execute('action').subscribe(
      (token) => {
        this.getRoles(token)
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
          this.getRoles(token);
        },
        (err) => {
          console.log(err);
        }
      )
      dtInstance.destroy();
    })
  }

  getRoles(token: any) {
    this.rolesService.getRoles(token).subscribe(
      (res: any) => {
        this.roles = res;
        this.dtTrigger.next();
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  getRole(id_role: string) {
    this.recaptchaV3Service.execute('action').subscribe(
      (token) => {
        this.rolesService.getRole(token, id_role).subscribe(
          (res: any) => {
            this.role = res;
            this.edit = true;
          },
          (error: any) => {
            console.log(error);
          }
        )
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  saveRole() {
    this.recaptchaV3Service.execute('action').subscribe(
      (token) => {
        this.role.token = token;
        if (this.role.name_role == '') {
          Swal.fire('Atención', 'Todos los campos son obligarios', 'error')
        } else {
          delete this.role.id_roles;
          delete this.role.updated_att;
          this.rolesService.saveRole(this.role).subscribe(
            (res: any) => {
              if (res['status']) {
                Swal.fire('¡Role!', res['message'], 'success');
                this.rerender();
                this.close();
              }
            },
            (error: any) => {
              if (error['status'] == 404) {
                Swal.fire('¡Error!', error['message'], 'error');
              }
            }
          )
        }
      },
      (error: any) => {

      }
    )
  }

  updateRole() {
    this.recaptchaV3Service.execute('action').subscribe(
      (token) => {
        this.role.token = token;
        delete this.role.created_att;
        this.rolesService.updateRole(this.role.id_roles, this.role).subscribe(
          (res: any) => {
            Swal.fire('¡Role!', res['message'], 'success');
            this.rerender();
            this.close();
          },
          (error: any) => {
            if (error['status'] == 404) {
              Swal.fire('¡Error!', error['message'], 'error');
            }
          }
        )
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  deleteRole(id_role: string) {
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
            this.rolesService.deleteRole(token, id_role).subscribe(
              (res: any) => {
                if (res['status']) {
                  Swal.fire('Eliminado', res['message'], 'success');
                  this.rerender();
                  this.edit = false;
                }
              },
              (error: any) => {
                if (error['status'] == 404) {
                  Swal.fire('¡Error!', error['message'], 'error');
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
