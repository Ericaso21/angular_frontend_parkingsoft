import { Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { RolesComponent } from 'src/app/pages/roles/roles.component';
import { UserComponent } from 'src/app/pages/user/user.component';

export const TemplateRoutingModule: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'roles', component: RolesComponent },
    { path: 'user', component: UserComponent }
]
