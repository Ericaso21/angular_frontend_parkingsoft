import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Client } from 'src/app/interfaces/client';
import { ClientService } from 'src/app/services/client.service';
import { API_URI } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styles: [],
})
export class ClientComponent implements OnInit {
  //open modal
  submitted: boolean = false;
  vehicleUsers: any;
  emailUser: any;
  imgURL: any;
  private API_URI = API_URI.url;
  plate_vehicle: any;
  public message: string | undefined;
  fileImage: any;

  //ngModel
  clientUser: Client | any = {
    token: '',
    email: '',
    vehicle_plate: '',
    model_number: '',
  };

  constructor(
    private recaptchaV3Service: ReCaptchaV3Service,
    private clientService: ClientService,
    config: NgbModalConfig,
    private modalService: NgbModal
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  open(content: any) {
    this.modalService.open(content);
  }

  close() {
    document.getElementById('closeModal')?.click();
    this.clientUser = {
      token: '',
      email: '',
      vehicle_plate: '',
      model_number: '',
    };
  }

  ngOnInit(): void {
    this.getvehicleUser();
  }

  preview(files: any, count: number, plate_vehicle: string) {
    if (files.length === 0) return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Only images are supported.';
      return;
    }

    var reader = new FileReader();
    this.fileImage = files[0];
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.vehicleUsers[count].name_file = reader.result;
    };
    this.updateImageVehicle(this.fileImage, plate_vehicle);
  }

  updateImageVehicle(file: any, vehicle_plate: string) {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.clientService
        .updateFileImageVehicle(file, vehicle_plate, token)
        .subscribe(
          (res: any) => {
            if (res['status']) {
              Swal.fire('¡Vehiculo!', res['message'], 'success');
              this.vehicleUsers = [];
              this.getvehicleUser();
              this.close();
            }
          },
          (error: any) => {
            console.log(error);
          }
        );
    });
  }

  getvehicleUser() {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.emailUser = localStorage.getItem('role');
      let emailUser = JSON.parse(this.emailUser);
      const form = {
        email: atob(emailUser.email),
      };
      this.clientService.getVehicle(form, token).subscribe(
        (res: any) => {
          for (let i = 0; i < res.length; i++) {
            if (res[i].name_file === null) {
              res[i].name_file = null;
            } else {
              res[
                i
              ].name_file = `${this.API_URI}/public/static/img/vehicle/${res[i].name_file}`;
            }
          }
          this.vehicleUsers = res;
        },
        (error: any) => {
          if (error['status'] == 404) {
            Swal.fire('¡Error!', error['error']['message'], 'error');
          }
        }
      );
    });
  }

  getVehicleUser(plate_vehicle: string) {
    this.plate_vehicle = plate_vehicle;
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.clientService.getVehicleUser(plate_vehicle, token).subscribe(
        (res: any) => {
          this.clientUser = res;
        },
        (error: any) => {
          if (error['status'] == 404) {
            Swal.fire('¡Error!', error['error']['message'], 'error');
          }
        }
      );
    });
  }

  updateVehicle() {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.clientUser.token = token;
      delete this.clientUser.email;
      this.clientService.update(this.plate_vehicle, this.clientUser).subscribe(
        (res: any) => {
          if (res['status']) {
            Swal.fire('¡Vehiculo!', res['message'], 'success');
            this.vehicleUsers = [];
            this.getvehicleUser();
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
}
