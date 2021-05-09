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
import { BlockTypes } from 'src/app/interfaces/block-types';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BlockTypesService } from 'src/app/services/block-types.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-block-types',
  templateUrl: './block-types.component.html',
  styles: [],
})
export class BlockTypesComponent implements AfterViewInit, OnDestroy, OnInit {
  //dataTable configuraciones
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  // variable que guarda los datos
  blockTypes: any;
  dtTrigger: Subject<any> = new Subject<any>();
  //open modal
  submitted: boolean = false;
  //modal actualizar
  edit: boolean = false;

  //permit
  _create: any;
  _edit: any;
  _delete: any;

  //Config ngModel
  blockType: BlockTypes | any = {
    token: '',
    id_block_type: 0,
    name_block_type: '',
    block_status: 0,
    created_att: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
    updated_att: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
  };

  constructor(
    private blockTypeServices: BlockTypesService,
    private recaptchaV3Service: ReCaptchaV3Service,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private authenticationService: AuthenticationService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  getCreatePermits() {
    this._create = this.authenticationService.getCreatePermits(
      'Tipos de Bloque'
    );
  }

  getEditPermits() {
    this._edit = this.authenticationService.getEditPermits('Tipos de Bloque');
  }

  getDeletePermits() {
    this._delete = this.authenticationService.getdeletePermits(
      'Tipos de Bloque'
    );
  }

  open(content: any) {
    this.modalService.open(content);
  }

  close() {
    document.getElementById('closeModal')?.click();
    this.blockType = {
      token: '',
      id_block_type: 0,
      name_block_type: '',
      block_status: 0,
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
        this.getBlockTypes(token);
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
          this.getBlockTypes(token);
        },
        (err) => {
          console.log(err);
        }
      );
      dtInstance.destroy();
    });
  }

  getBlockTypes(token: any) {
    this.blockTypeServices.getBlockTypes(token).subscribe(
      (res: any) => {
        this.blockTypes = res;
        this.dtTrigger.next();
      },
      (error: any) => {}
    );
  }

  getOneBlockType(id: string) {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.blockTypeServices.getBlockType(token, id).subscribe(
        (res: any) => {
          this.blockType = res;
          this.edit = true;
        },
        (error: any) => {
          console.log(error);
        }
      );
    });
  }

  saveBlockType() {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.blockType.token = token;
      if (
        this.blockType.name_block_type == '' ||
        this.blockType.block_status == 0
      ) {
        Swal.fire('¡Atencion!,  Todos los campos son obligatorios');
      } else {
        delete this.blockType.id_block_type;
        delete this.blockType.updated_att;
        this.blockTypeServices.saveBlockType(this.blockType).subscribe(
          (res: any) => {
            if (res['status']) {
              Swal.fire('¡Bloque!', res['message'], 'success');
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

  updateBlockType() {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.blockType.token = token;
      delete this.blockType.created_att;
      this.blockTypeServices
        .updateBlockType(this.blockType.id_block_type, this.blockType)
        .subscribe(
          (res: any) => {
            if (res['status']) {
              Swal.fire('¡Bloque!', res['message'], 'success');
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

  deleteBlockType(id: string) {
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
            this.blockTypeServices.deleteBlockType(token, id).subscribe(
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
