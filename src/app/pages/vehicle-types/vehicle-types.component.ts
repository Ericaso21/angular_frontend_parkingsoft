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
import { VehicleTypes } from 'src/app/interfaces/vehicle-types';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { VehicleTypesService } from 'src/app/services/vehicle-types.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vehicle-types',
  templateUrl: './vehicle-types.component.html',
  styles: [],
})
export class VehicleTypesComponent implements OnInit, AfterViewInit, OnDestroy {
  //dataTable configuraciones
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  //modal actualizar
  edit: boolean = false;

  // variable que guarda los datos
  vehicleTypes: any;
  dtTrigger: Subject<any> = new Subject<any>();
  //open modal
  submitted: boolean = false;

  //permit
  _create: any;
  _edit: any;
  _delete: any;
  //definicion NgModel
  vehicleType: VehicleTypes | any = {
    token: '',
    id_vehicle_type: 0,
    vehicle_name: '',
    status_vehicle: 0,
    created_att: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
    updated_att: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
  };

  constructor(
    private vehicleTypeServices: VehicleTypesService,
    private recaptchaV3Service: ReCaptchaV3Service,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private authenticationService: AuthenticationService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  getCreatePermits() {
    this._create = this.authenticationService.getCreatePermits('Roles');
  }

  getEditPermits() {
    this._edit = this.authenticationService.getEditPermits('Roles');
  }

  getDeletePermits() {
    this._delete = this.authenticationService.getdeletePermits('Roles');
  }
  open(content: any) {
    this.modalService.open(content);
  }

  close() {
    document.getElementById('closeModal')?.click();
    this.vehicleType = {
      token: '',
      id_vehicle_type: 0,
      vehicle_name: '',
      status_vehicle: 0,
      created_att: new Date(),
      updated_att: new Date(),
    };
  }

  ngOnInit(): void {
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
      order: [0, 'asc'],
    };
  }

  ngAfterViewInit(): void {
    this.recaptchaV3Service.execute('action').subscribe(
      (token) => {
        this.getvehicleTypes(token);
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
          this.getvehicleTypes(token);
        },
        (err) => {
          console.log(err);
        }
      );
      dtInstance.destroy();
    });
  }

  getvehicleTypes(token: any) {
    this.vehicleTypeServices.getVehicleTypes(token).subscribe(
      (res: any) => {
        this.vehicleTypes = res;
        this.dtTrigger.next();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  getOnevehicleType(id: string) {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.vehicleTypeServices.getVehicleType(token, id).subscribe(
        (res: any) => {
          this.vehicleType = res;
          this.edit = true;
        },
        (error: any) => {
          console.log(error);
        }
      );
    });
  }

  savevehicleType() {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.vehicleType.token = token;
      if (
        this.vehicleType.vehicle_name == '' ||
        this.vehicleType.status_vehicle == 0
      ) {
        Swal.fire('Atención', 'Todos los campos son obligarios', 'error');
      } else {
        delete this.vehicleType.id_vehicle_type;
        delete this.vehicleType.updated_att;
        this.vehicleTypeServices.saveVehicleType(this.vehicleType).subscribe(
          (res: any) => {
            if (res['status']) {
              Swal.fire('¡Tipo de Vehiculo!', res['message'], 'success');
              this.rerender();
              this.close();
            }
          },
          (error: any) => {
            if (error['status'] == 404) {
              Swal.fire('¡Error!', error['message'], 'error');
            }
          }
        );
      }
    });
  }
  updatevehicleType() {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.vehicleType.token = token;
      delete this.vehicleType.created_att;
      this.vehicleTypeServices
        .updateVehicleType(this.vehicleType.id_vehicle_type, this.vehicleType)
        .subscribe(
          (res: any) => {
            if (res['status']) {
              Swal.fire('¡Tipo de Vehiculo!', res['message'], 'success');
              this.rerender();
              this.close();
            }
          },
          (error: any) => {
            if (error['status'] == 404) {
              Swal.fire('¡Error!', error['message'], 'error');
            }
          }
        );
    });
  }

  deletevehicleType(id: string) {
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
            this.vehicleTypeServices.deleteVehicleType(token, id).subscribe(
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
