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
import { Rates } from 'src/app/interfaces/rates';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RatesService } from 'src/app/services/rates.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styles: [],
})
export class RatesComponent implements AfterViewInit, OnDestroy, OnInit {
  //dataTable configuraciones
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  rates: any;
  vehicleType: any;
  dtTrigger: Subject<any> = new Subject<any>();

  //definicion NgModel
  rate: Rates | any = {
    token: '',
    id_rate: 0,
    fk_id_vehicle_type: 0,
    minute_rate: '',
    hourly_rate: '',
    day_rate: '',
    rate_status: 0,
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
    private ratesServices: RatesService,
    private recaptchaV3Service: ReCaptchaV3Service,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private authenticationService: AuthenticationService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  getCreatePermits() {
    this._create = this.authenticationService.getCreatePermits('Tarifas');
  }

  getEditPermits() {
    this._edit = this.authenticationService.getEditPermits('Tarifas');
  }

  getDeletePermits() {
    this._delete = this.authenticationService.getdeletePermits('Tarifas');
  }

  open(content: any) {
    this.modalService.open(content);
  }

  close() {
    document.getElementById('closeModal')?.click();
  }

  getVehicleType() {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.ratesServices.getVehicleType(token).subscribe(
        (res: any) => {
          this.vehicleType = res;
        },
        (error: any) => {
          console.log(error);
        }
      );
    });
  }

  ngOnInit(): void {
    this.getVehicleType();
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
      order: [1, 'asc'],
    };
  }

  ngAfterViewInit(): void {
    this.recaptchaV3Service.execute('action').subscribe(
      (token) => {
        this.getRates(token);
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
          this.getRates(token);
        },
        (err) => {
          console.log(err);
        }
      );
      dtInstance.destroy();
    });
  }

  getRates(token: any) {
    this.ratesServices.getRates(token).subscribe(
      (res: any) => {
        this.rates = res;
        console.log(this.rates);
        this.dtTrigger.next();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getRate(id: string) {
    this.recaptchaV3Service.execute('action').subscribe(
      (token) => {
        this.ratesServices.getRate(token, id).subscribe(
          (res: any) => {
            this.rate = res;
            this.edit = true;
          },
          (error: any) => {
            console.log(error);
          }
        );
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  saveRate() {
    this.recaptchaV3Service.execute('action').subscribe(
      (token) => {
        this.rate.token = token;
        if (
          this.rate.minute_rate == '' ||
          this.rate.hourly_rate == '' ||
          this.rate.day_rate == '' ||
          this.rate.rate_status == 0 ||
          this.rate.fk_id_vehicle_type == 0
        ) {
          Swal.fire('Atención', 'Todos los campos son obligarios', 'error');
        } else {
          delete this.rate.id_rate;
          delete this.rate.updated_att;
          this.rate.created_att = new Date()
            .toISOString()
            .replace(/T/, ' ')
            .replace(/\..+/, '');
          this.ratesServices.saveRates(this.rate).subscribe(
            (res: any) => {
              if (res['status']) {
                Swal.fire('¡Tarifa!', res['message'], 'success');
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
      },
      (error: any) => {}
    );
  }

  updateRate() {
    this.recaptchaV3Service.execute('action').subscribe(
      (token) => {
        this.rate.token = token;
        delete this.rate.created_att;
        this.rate.updated_att = new Date()
          .toISOString()
          .replace(/T/, ' ')
          .replace(/\..+/, '');
        this.ratesServices.updateRate(this.rate.id_rate, this.rate).subscribe(
          (res: any) => {
            Swal.fire('Tarifa!', res['message'], 'success');
            this.rerender();
            this.close();
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

  deleteRate(id_rate: string) {
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
            this.ratesServices.deleteRate(token, id_rate).subscribe(
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
