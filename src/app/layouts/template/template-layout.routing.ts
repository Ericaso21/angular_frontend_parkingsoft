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

export const TemplateRoutingModule: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'roles', component: RolesComponent },
    { path: 'blocktypes', component: BlockTypesComponent },
    { path: 'rates', component: RatesComponent },
    { path: 'vehicleTypes', component: VehicleTypesComponent },
    { path: 'user', component: UserComponent },
    { path: 'accessPermit', component: AcessPermitComponent },
    { path: 'bill', component: BillComponent },
    { path: 'vehicle', component: VehicleComponent },
    { path: 'ticket', component: TicketComponent },
    { path: 'blocks', component: BlocksComponent }
]
