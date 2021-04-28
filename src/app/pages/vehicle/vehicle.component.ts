import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Subject } from 'rxjs';
import { Vehicle } from 'src/app/interfaces/vehicle';
import { VehicleService } from 'src/app/services/vehicle.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styles: [
  ]
})
export class VehicleComponent implements AfterViewInit,OnDestroy,OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  vehicles: any;
  vehicle_types: any;
  documents: any; 
  dtTrigger: Subject<any> = new Subject<any>();

  vehicle:Vehicle | any= {
    token: '',
    vehicle_plate:'',
    fk_document_number: 0, 
    fk_id_vehicle_type: 0,
    model_number: '',
    vehicle_status: 0,
    created_att: new Date,
    updated_att: new Date,
  }

   //modal actualizar
   edit: boolean = false;
   //open modal
   submitted: boolean = false;

  constructor(private vehicleServices: VehicleService,  private recaptchaV3Service: ReCaptchaV3Service, config: NgbModalConfig, private modalService: NgbModal)
  {     
  config.backdrop = 'static';
  config.keyboard = false;
  }

  open(content: any) {
    this.modalService.open(content);
  }

  
  close() {
    document.getElementById('closeModal')?.click();
    this.vehicle ={
      token: '',
      vehicle_plate:'',
      fk_document_number:'', 
      fk_id_vehicle_type: 0,
      model_number:'',
      vehicle_status: 0,
      created_att: new Date,
      updated_att: new Date,
    }
  }


  ngOnInit(): void {
    this.getVehicleType();
    this.getDocumentUser();
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
        this.getVehicles(token)
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
          this.getVehicles(token);
        },
        (err) => {
          console.log(err);
        }
      )
      dtInstance.destroy();
    })
  }

  getDocumentUser(){
    this.recaptchaV3Service.execute('action').subscribe(
      (token) => {
        this.vehicleServices.getDocumentUser(token).subscribe(
          (res: any) => {
            this.documents = res;    
          }
        )
      }
    )
  }

  getVehicleType(){
    this.recaptchaV3Service.execute('action').subscribe(
      (token) => {
        this.vehicleServices.getVehicleType(token).subscribe(
          (res: any) => {
            this.vehicle_types = res;    
          }
        )
      }
    )
  }

  getVehicles(token: any) {
    this.vehicleServices.getVehicles(token).subscribe(
      (res: any) => {
        this.vehicles = res;
        console.log(this.vehicles);
        this.dtTrigger.next();
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  getVehicle(id: string) {
    this.recaptchaV3Service.execute('action').subscribe(
      (token) => {
        this.vehicleServices.getVehicle(token, id).subscribe(
          (res: any) => {
            this.vehicle = res;
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

  saveVehicle() {
    this.recaptchaV3Service.execute('action').subscribe(
      (token) => {
        this.vehicle.token = token;
        if (this.vehicle.vehicle_plate == '' || this.vehicle.fk_document_number == '') {
          Swal.fire('Atención', 'Todos los campos son obligarios', 'error')
        } else {
          delete this.vehicle.updated_att;
          this.vehicleServices.saveVehicle(this.vehicle).subscribe(
            (res: any) => {
              if (res['status']) {
                Swal.fire('¡Vehiculo!', res['message'], 'success');
                this.rerender();
                this.close();
              }
            },
            (error: any) => {
              if (error['status'] == 404) {
                Swal.fire('¡Error!', error['error']['message'], 'error');
              }
            }
          )
        }
      },
      (error: any) => {

      }
    )
  }

  updateVehicle() {
    this.recaptchaV3Service.execute('action').subscribe(
      (token) => {
        this.vehicle.token = token;
        delete this.vehicle.created_att;
        this.vehicleServices.updateVehicle(this.vehicle.vehicle_plate , this.vehicle).subscribe(
          (res: any) => {
            Swal.fire('Vehiculo!', res['message'], 'success');
            this.rerender();
            this.close();
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

  deleteVehicle(vehicle_plate : string) {
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
            this.vehicleServices.deleteVehicle(token, vehicle_plate ).subscribe(
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
