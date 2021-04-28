import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
  path: string,
  title: string,
  icon: string,
  class: string
}

export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'ni-tv-2 text-primary', class: '' },
  { path: '/roles', title: 'Roles', icon: 'ni-single-02 text-primary', class: '' },
  { path: '/blocktypes', title: 'Tipos de Bloque', icon: 'ni ni-ungroup text-primary', class: '' },
  { path: '/rates', title: 'Tarifas', icon: 'ni ni-money-coins text-primary', class: '' },
  { path: '/vehicleTypes', title: 'Tipos de Vehiculos', icon: 'ni ni-ambulance text-primary', class: '' },
  { path: '/user', title: 'Usuarios', icon: 'ni-single-02 text-primary', class: '' },
  { path: '/accessPermit', title: 'Permisos', icon: 'ni ni-lock-circle-open text-primary', class: '' },
  { path: '/ticket', title: 'Ticket', icon: 'ni ni-tag text-primary', class: '' },
  { path: '/bill', title: 'Facturas', icon: 'ni ni-book-bookmark text-primary', class: '' }
]



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  public menuItems: any[] = [];
  public isCollapsed = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    })
  }

}
