import { Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { RolesComponent } from 'src/app/pages/roles/roles.component';
import { VehicleTypesComponent } from 'src/app/pages/vehicle-types/vehicle-types.component';

export const TemplateRoutingModule: Routes = [
    {path: 'dashboard', component: DashboardComponent},
    { path: 'roles', component: RolesComponent},
    {path:'vehicleTypes',component: VehicleTypesComponent}
]
