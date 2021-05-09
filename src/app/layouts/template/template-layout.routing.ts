import { Routes } from '@angular/router';
import { BlockTypesComponent } from 'src/app/pages/block-types/block-types.component';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { RatesComponent } from 'src/app/pages/rates/rates.component';
import { RolesComponent } from 'src/app/pages/roles/roles.component';
import { VehicleTypesComponent } from 'src/app/pages/vehicle-types/vehicle-types.component';
import { UserComponent } from 'src/app/pages/user/user.component';
import { AcessPermitComponent } from 'src/app/pages/acess-permit/acess-permit.component';
import { VehicleComponent } from 'src/app/pages/vehicle/vehicle.component';
import { TicketComponent } from 'src/app/pages/ticket/ticket.component';
import { BillComponent } from 'src/app/pages/bill/bill.component';
import { BlocksComponent } from 'src/app/pages/blocks/blocks.component';
import { DashboardGuard } from 'src/app/guards/permit/dashboard.guard';
import { RolesGuard } from 'src/app/guards/permit/roles.guard';
import { UsuariosGuard } from 'src/app/guards/permit/usuarios.guard';
import { BillGuard } from 'src/app/guards/permit/bill.guard';
import { BlockTypesGuard } from 'src/app/guards/permit/block-types.guard';
import { BlocksGuard } from 'src/app/guards/permit/blocks.guard';
import { PermitGuard } from 'src/app/guards/permit/permit.guard';
import { RatesGuard } from 'src/app/guards/permit/rates.guard';
import { TicketGuard } from 'src/app/guards/permit/ticket.guard';
import { VehicleTypesGuard } from 'src/app/guards/permit/vehicle-types.guard';
import { VehiclesGuard } from 'src/app/guards/permit/vehicles.guard';

export const TemplateRoutingModule: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [DashboardGuard],
  },
  { path: 'roles', component: RolesComponent, canActivate: [RolesGuard] },
  {
    path: 'blocktypes',
    component: BlockTypesComponent,
    canActivate: [BlockTypesGuard],
  },
  { path: 'rates', component: RatesComponent, canActivate: [RatesGuard] },
  {
    path: 'vehicleTypes',
    component: VehicleTypesComponent,
    canActivate: [VehicleTypesGuard],
  },
  { path: 'user', component: UserComponent, canActivate: [UsuariosGuard] },
  {
    path: 'accessPermit',
    component: AcessPermitComponent,
    canActivate: [PermitGuard],
  },
  { path: 'bill', component: BillComponent, canActivate: [BillGuard] },
  {
    path: 'vehicle',
    component: VehicleComponent,
    canActivate: [VehiclesGuard],
  },
  { path: 'ticket', component: TicketComponent, canActivate: [TicketGuard] },
  { path: 'blocks', component: BlocksComponent, canActivate: [BlocksGuard] },
];
