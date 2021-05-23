import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { API_URI } from 'src/environments/environment';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    icon: 'ni-tv-2 text-primary',
    class: '',
  },
  {
    path: '/roles',
    title: 'Roles',
    icon: 'ni-single-02 text-primary',
    class: '',
  },
  {
    path: '/user',
    title: 'Usuarios',
    icon: 'ni-single-02 text-primary',
    class: '',
  },
  {
    path: '/blocktypes',
    title: 'Tipos de Bloque',
    icon: 'ni ni-ungroup text-primary',
    class: '',
  },
  {
    path: '/blocks',
    title: 'Bloques',
    icon: 'ni ni-ungroup text-primary',
    class: '',
  },
  {
    path: '/vehicleTypes',
    title: 'Tipos de Vehiculos',
    icon: 'ni ni-ambulance text-primary',
    class: '',
  },
  {
    path: '/vehicle',
    title: 'Vehiculos',
    icon: 'ni ni-delivery-fast text-primary',
    class: '',
  },
  {
    path: '/ticket',
    title: 'Ticket',
    icon: 'ni ni-tag text-primary',
    class: '',
  },
  {
    path: '/bill',
    title: 'Facturas',
    icon: 'ni ni-book-bookmark text-primary',
    class: '',
  },
  {
    path: '/rates',
    title: 'Tarifas',
    icon: 'ni ni-money-coins text-primary',
    class: '',
  },
  {
    path: '/accessPermit',
    title: 'Permisos',
    icon: 'ni ni-lock-circle-open text-primary',
    class: '',
  },
  {
    path: '/client',
    title: 'Cliente',
    icon: 'ni-single-02 text-primary',
    class: '',
  },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent implements OnInit {
  public menuItems: any[] = [];
  public isCollapsed = true;
  public permits: any[] = [];
  public permitdene: any[] = [];
  imgURL: any;
  private API_URI = API_URI.url;

  constructor(
    private router: Router,
    public authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.imageUserData();
    this.getPermit();
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }

  imageUserData() {
    let userData = this.authenticationService.getUserData();
    if (userData.name_file === null || userData.name_file === undefined) {
      this.imgURL = null;
    } else {
      this.imgURL = `${this.API_URI}/public/static/img/user/${userData.name_file}`;
    }
  }

  logout() {
    this.authenticationService.logout();
  }

  getPermit() {
    this.permits = this.authenticationService.getPermits();
    for (let i = 0; i < ROUTES.length; i++) {
      if (
        ROUTES[i]['title'].toLowerCase() ==
          this.permits[i]['name_modules'].toLowerCase() &&
        this.permits[i]['view_modules'] == 1
      ) {
        this.permitdene[i] = ROUTES[i];
      } else {
        delete ROUTES[i];
      }
    }
    this.menuItems = this.permitdene;
    this.menuItems.sort();
  }
}
