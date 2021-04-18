import { Routes } from '@angular/router';
import { BlockTypesComponent } from 'src/app/pages/block-types/block-types.component';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { RolesComponent } from 'src/app/pages/roles/roles.component';

export const TemplateRoutingModule: Routes = [
    {path: 'dashboard', component: DashboardComponent},
    { path: 'roles', component: RolesComponent},
    {path: 'blocktypes', component: BlockTypesComponent}
]
