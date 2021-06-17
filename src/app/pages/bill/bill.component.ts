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
import { BillsService } from 'src/app/services/bills.service';
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styles: [],
})
export class BillComponent implements AfterViewInit, OnDestroy, OnInit {
  //dataTable configuraciones
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  // variable que guarda los datos
  bills: any;
  billTicket: any;
  dtTrigger: Subject<any> = new Subject<any>();

  //open modal
  submitted: boolean = false;

  constructor(
    private billsService: BillsService,
    private recaptchaV3Service: ReCaptchaV3Service,
    config: NgbModalConfig,
    private modalService: NgbModal
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  open(content: any) {
    this.modalService.open(content);
  }

  ngOnInit(): void {
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
        this.getBills(token);
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
          this.getBills(token);
        },
        (err) => {
          console.log(err);
        }
      );
      dtInstance.destroy();
    });
  }

  downloadPDF() {
    // Extraemos el
    const DATA = window.document.getElementById('htmlData') as HTMLInputElement;
    domtoimage.toPng(DATA).then((dataUrl) => {
      let imagen = new Image();
      imagen.src = dataUrl;
      const bufferX = 180;
      const bufferY = 10;
      let pdf = new jsPDF('p', 'pt', 'a4');
      pdf.addImage(imagen, bufferX, bufferY, 280, 170);
      pdf.save(`${new Date().toISOString()}_tutorial.pdf`);
    });
  }

  getTicketBill(id: string) {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.billsService.getTicket(token, id).subscribe(
        (res: any) => {
          this.billTicket = res;
          console.log(this.billTicket);
        },
        (error: any) => {
          console.log(error);
        }
      );
    });
  }

  getBills(token: any) {
    this.billsService.getBill(token).subscribe(
      (res: any) => {
        this.bills = res;
        this.dtTrigger.next();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  deleteBill(id: string) {
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
            this.billsService.deleteBill(token, id).subscribe(
              (res: any) => {
                if (res['status']) {
                  Swal.fire('Factura', res['message'], 'success');
                  this.rerender();
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
