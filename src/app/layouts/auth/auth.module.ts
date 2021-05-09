import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { RouterModule } from '@angular/router';
import { AuthLayoutRoutes } from './auth-routing.module';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from 'src/app/pages/register/register.component';

@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(AuthLayoutRoutes)],
})
export class AuthModule {}
