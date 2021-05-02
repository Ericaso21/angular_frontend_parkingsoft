import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Subject } from 'rxjs';
import { Blocks } from 'src/app/interfaces/blocks';
import { BlocksService } from 'src/app/services/blocks.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styles: [
  ]
})
export class BlocksComponent implements AfterViewInit, OnDestroy, OnInit {
  //dataTable configuraciones
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  // variable que guarda los datos
  blocks: any;
  blockTypes: any;
  dtTrigger: Subject<any> = new Subject<any>();

  //definicion NgModel
  block: Blocks | any = {
    token: '',
    id_block: 0,
    fk_id_block_type: 0,
    block_number: '',
    block_status: 0,
    created_att: new Date(),
    updated_att: new Date()
  }

  //modal actualizar
  edit: boolean = false;
  //open modal
  submitted: boolean = false;

  constructor(private blocksService: BlocksService, private recaptchaV3Service: ReCaptchaV3Service, config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  open(content: any) {
    this.modalService.open(content);
  }

  close() {
    document.getElementById('closeModal')?.click();
  }

  ngOnInit(): void {
    this.getBlockTypes();
    this.dtOptions = {
      responsive: true,
      processing: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.22/i18n/Spanish.json"
      },
      destroy: true,
      autoWidth: true,
      order: [3, 'asc']
    };
  }

  ngAfterViewInit(): void {
    this.recaptchaV3Service.execute('action').subscribe(
      (token) => {
        this.getBlocks(token)
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
          this.getBlocks(token);
        },
        (err) => {
          console.log(err);
        }
      )
      dtInstance.destroy();
    })
  }

  getBlockTypes() {
    this.recaptchaV3Service.execute('action').subscribe(
      (token) => {
        this.blocksService.getBlockType(token).subscribe(
          (res: any) => {
            this.blockTypes = res;
          },
          (error: any) => {
            console.log(error);
          }
        )
      }
    )
  }

  getBlocks(token: any) {
    this.blocksService.getBlocks(token).subscribe(
      (res: any) => {
        this.blocks = res;
        this.dtTrigger.next();
      },
      (error: any) => {
        console.log(error);
      }
    )
  }

  getBlock(id: string) {
    this.recaptchaV3Service.execute('action').subscribe(
      (token) => {
        this.blocksService.getBlock(token, id).subscribe(
          (res: any) => {
            this.block = res;
            this.edit = true;
          },
          (error: any) => {
            console.log(error);
          }
        )
      }
    )
  }

  saveBlock() {
    this.recaptchaV3Service.execute('action').subscribe(
      (token) => {
        this.block.token = token;
        delete this.block.id_block;
        delete this.block.updated_att;
        this.blocksService.saveBlock(this.block).subscribe(
          (res: any) => {
            if (res['status']) {
              Swal.fire('¡Bloque!', res['message'], 'success');
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
    )
  }

  updateBlock() {
    this.recaptchaV3Service.execute('action').subscribe(
      (token) => {
        this.block.token = token;
        delete this.block.created_att;
        this.blocksService.updateBlock(this.block, this.block.id_block).subscribe(
          (res: any) => {
            if (res['status']) {
              Swal.fire('¡Bloque!', res['message'], 'success');
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
    )
  }

  deleteBlock(id: string) {
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
            this.blocksService.deleteBlock(token, id).subscribe(
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
