import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { LoginComponent } from 'src/app/pages/login/login.component';
import { RouterModule } from '@angular/router';
import { AuthLayoutRoutes } from './auth-routing.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule
  ]
})
export class AuthModule { }
