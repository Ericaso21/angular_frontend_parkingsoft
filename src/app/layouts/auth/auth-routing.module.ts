import { Routes } from '@angular/router';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { NewPasswordComponent } from 'src/app/pages/new-password/new-password.component';
import { RegisterComponent } from 'src/app/pages/register/register.component';

export const AuthLayoutRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password/:id', component: NewPasswordComponent },
];
