import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TemplateRoutingModule } from './template-layout.routing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { RolesComponent } from 'src/app/pages/roles/roles.component';
import { DataTablesModule } from 'angular-datatables';
import { RatesComponent } from 'src/app/pages/rates/rates.component';



@NgModule({
  declarations: [
    DashboardComponent,
    RolesComponent,
    RatesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(TemplateRoutingModule),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    DataTablesModule
  ]
})
export class TemplateModule { }
