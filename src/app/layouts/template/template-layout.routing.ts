import { Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { RatesComponent } from 'src/app/pages/rates/rates.component';
import { RolesComponent } from 'src/app/pages/roles/roles.component';

export const TemplateRoutingModule: Routes = [
    {path: 'dashboard', component: DashboardComponent},
    { path: 'roles', component: RolesComponent},
    { path: 'rates', component: RatesComponent},
]
