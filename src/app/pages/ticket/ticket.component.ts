import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Subject } from 'rxjs';
import { Ticket } from 'src/app/interfaces/ticket';
import { TicketService } from 'src/app/services/ticket.service';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';
import { formatDate } from '@angular/common';
import { BillsService } from 'src/app/services/bills.service';
import { Bill } from 'src/app/interfaces/bill';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styles: [],
})
export class TicketComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('content2', { static: false }) contenidoDelModal: any;
  @ViewChild('content3', { static: false }) contenidoDelModal2: any;
  //dataTable configuraciones
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  // variable que guarda los datos
  tickets: any;
  blocks: any;
  vehicles: any;
  pdfticket: any;
  billTicket: any;
  date = formatDate(new Date(), 'yyyy/MM/dd', 'en');
  dtTrigger: Subject<any> = new Subject<any>();

  //definicion NgModel
  ticket: Ticket | any = {
    token: '',
    id_ticket: 0,
    entry_time: new Date(),
    departure_time: new Date(),
    pk_fk_id_block: 0,
    fk_id_vehicle: 0,
    created_att: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
    updated_att: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
  };

  //definiton bill NgModel
  bill: Bill | any = {
    token: '',
    id_ticket: 0,
  };

  //modal actualizar
  edit: boolean = false;
  //open modal
  submitted: boolean = false;

  //permit
  _create: any;
  _edit: any;
  _delete: any;
  _view: any;

  constructor(
    private billService: BillsService,
    private ticketService: TicketService,
    private recaptchaV3Service: ReCaptchaV3Service,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private authenticationService: AuthenticationService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  getCreatePermits() {
    this._create = this.authenticationService.getCreatePermits('Ticket');
  }

  getEditPermits() {
    this._edit = this.authenticationService.getEditPermits('Ticket');
  }

  getDeletePermits() {
    this._delete = this.authenticationService.getdeletePermits('Ticket');
  }

  getViewPermits() {
    this._view = this.authenticationService.getViewPermits('Ticket');
  }

  open(content: any) {
    this.modalService.open(content);
  }

  openModal(content2: any) {
    console.log(content2);
    this.modalService.open(content2);
  }

  close() {
    document.getElementById('closeModal')?.click();
    this.ticket = {
      token: '',
      id_ticket: 0,
      entry_time: new Date(),
      departure_time: new Date(),
      pk_fk_id_block: 0,
      fk_id_vehicle: 0,
      created_att: new Date(),
      updated_att: new Date(),
    };
  }

  ngOnInit(): void {
    this.getVehicles();
    this.getCreatePermits();
    this.getEditPermits();
    this.getDeletePermits();
    this.getViewPermits();
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
        this.getTickets(token);
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
          this.getTickets(token);
        },
        (err) => {
          console.log(err);
        }
      );
      dtInstance.destroy();
    });
  }

  getBlocks() {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.ticketService.getBlocks(token).subscribe(
        (res: any) => {
          this.blocks = res;
        },
        (error: any) => {
          console.log(error);
        }
      );
    });
  }

  getBlocksClose() {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.ticketService.getBlocksClose(token).subscribe(
        (res: any) => {
          this.blocks = res;
        },
        (error: any) => {
          console.log(error);
        }
      );
    });
  }

  getVehicles() {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.ticketService.getVehicles(token).subscribe(
        (res: any) => {
          this.vehicles = res;
        },
        (error: any) => {
          console.log(error);
        }
      );
    });
  }

  getTickets(token: any) {
    this.ticketService.getTickets(token).subscribe(
      (res: any) => {
        this.tickets = res;
        this.dtTrigger.next();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getTicket(id: string) {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.ticketService.getTicket(token, id).subscribe(
        (res: any) => {
          this.ticket = res;
          this.edit = true;
        },
        (error: any) => {
          console.log(error);
        }
      );
    });
  }

  getTicketPDF(id: string) {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.ticketService.getOnePDF(token, id).subscribe(
        (res: any) => {
          this.pdfticket = res;
          console.log(this.pdfticket);
        },
        (error: any) => {
          console.log(error);
        }
      );
    });
  }

  getTicketBill(id: string) {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.billService.getTicket(token, id).subscribe(
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

  saveTicket() {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.ticket.token = token;
      if (
        this.ticket.pk_fk_id_block == 0 ||
        this.ticket.fk_id_vehicle == 0 ||
        this.ticket.entry_time == ''
      ) {
        Swal.fire('Atención', 'Todos los campos son obligarios', 'error');
      } else {
        delete this.ticket.id_ticket;
        delete this.ticket.departure_time;
        delete this.ticket.updated_att;
        this.ticketService.saveTicket(this.ticket).subscribe(
          (res: any) => {
            if (res['status']) {
              Swal.fire('Ticket!', res['message'], 'success');
              this.rerender();
              this.close();
              this.getTicketPDF(res['id_ticket']);
              this.modalService.open(this.contenidoDelModal);
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

  updateTicket() {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.ticket.token = token;
      delete this.ticket.created_att;
      delete this.ticket.entry_time;
      delete this.ticket.fk_id_vehicle;
      this.ticketService
        .updateTicket(this.ticket.id_ticket, this.ticket)
        .subscribe(
          (res: any) => {
            if (res['status']) {
              Swal.fire('Ticket!', res['message'], 'success');
              this.rerender();
              this.close();
              this.saveBill(res['id_ticket']);
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

  saveBill(id_ticket: String) {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.bill.token = token;
      this.bill.id_ticket = id_ticket;
      this.billService.saveBill(this.bill).subscribe(
        (res: any) => {
          if (res['status']) {
            this.getTicketBill(res['id_ticket']);
            this.modalService.open(this.contenidoDelModal2);
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
    });
  }

  deleteTicket(id: string) {
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
            this.ticketService.deleteTicket(token, id).subscribe(
              (res: any) => {
                if (res['status']) {
                  Swal.fire('Ticket', res['message'], 'success');
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
