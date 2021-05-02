import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/authentication/auth.guard';
import { AuthComponent } from './layouts/auth/auth.component';
import { TemplateComponent } from './layouts/template/template.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: TemplateComponent,
    children: [
      { path: '', loadChildren: () => import('src/app/layouts/template/template.module').then(m => m.TemplateModule) }
    ],
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: '', loadChildren: () => import('src/app/layouts/auth/auth.module').then(m => m.AuthModule) }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
