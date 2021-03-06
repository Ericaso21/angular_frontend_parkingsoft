import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Subject } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [],
})
export class DashboardComponent implements AfterViewInit, OnDestroy, OnInit {
  //dataTable configuraciones
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings | any = {};
  // variable que guarda los datos
  reports: any;
  report_filter: any = [];
  dtTrigger: Subject<any> = new Subject<any>();

  //modal actualizar
  edit: boolean = false;

  _create: any;

  sub_total: any;
  iva: any;
  total: any;

  //filter data
  filter = {
    token: '',
    data_begin: new Date(),
    data_end: new Date(),
  };

  // open filter
  filter_dates: boolean = false;

  constructor(
    private recaptchaV3Service: ReCaptchaV3Service,
    private authenticationService: AuthenticationService,
    private reportService: ReportService
  ) {}

  getCreatePermits() {
    this._create = this.authenticationService.getCreatePermits('Dashboard');
  }

  filterData() {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.filter.token = token;
      this.reportService.filerData(this.filter).subscribe(
        (res: any) => {
          if (this.report_filter === '') {
            this.rerender();
            this.report_filter = res;
            this.reports = res;
            this.dtTrigger.next();
            this.ngAfterViewInit();
          } else {
            this.rerender();
            this.report_filter = res;
            this.reports = res;
            this.dtTrigger.next();
            this.ngAfterViewInit();
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
    });
  }

  ngOnInit(): void {
    this.getCreatePermits();
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
      dom: 'Bfrtip',
      buttons: [
        {
          extend: 'print',
          text: '<i class="fas fa-print"></i>',
          titleAttr: 'Imprimir',
        },
        {
          extend: 'excel',
          text: '<i class="far fa-file-excel"></i>',
          titleAttr: 'Excel',
        },
        {
          extend: 'colvis',
          text: '<i class="fas fa-columns"></i>',
          titleAttr: 'Visualizaci??n',
        },
      ],
    };
  }

  ngAfterViewInit(): void {
    this.recaptchaV3Service.execute('action').subscribe(
      (token) => {
        this.getReport(token);
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
          this.getReport(token);
        },
        (err) => {
          console.log(err);
        }
      );
      dtInstance.destroy();
    });
  }

  getReport(token: any) {
    if (this.report_filter.length === 0) {
      this.reportService.getReport(token).subscribe(
        (res: any) => {
          this.reports = res;
          this.getTotalReport(res);
          this.dtTrigger.next();
        },
        (error: any) => {
          console.log(error);
        }
      );
    } else {
      this.report_filter;
      this.filter_dates = false;
      this.getTotalReport(this.report_filter);
      this.filter = {
        token: '',
        data_begin: new Date(),
        data_end: new Date(),
      };
    }
  }

  getTotalReport(reports: any) {
    let subtotal = 0;
    let total = 0;
    let iva = 0;
    for (let i = 0; i < reports.length; i++) {
      subtotal += parseFloat(reports[i]['subtotal_value']);
      iva += parseFloat(reports[i]['iva_value']);
      total += parseFloat(reports[i]['total_value']);
    }
    this.sub_total = subtotal.toFixed(3);
    this.iva = iva;
    this.total = total;
  }
}
