import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ROUTES } from '../sidebar/sidebar.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { API_URI } from 'src/environments/environment';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [],
})
export class NavbarComponent implements OnInit {
  public focus: any;
  public listTitles: any[] = [];
  public location: Location;
  public user: any = {};
  public userName: any;
  imgURL: any;
  responseLocalStorage: any;
  private API_URI = API_URI.url;

  constructor(
    location: Location,
    public authenticationService: AuthenticationService
  ) {
    this.location = location;
  }

  ngOnInit(): void {
    this.imageProfile();
    this.listTitles = ROUTES.filter((listTitle) => listTitle);
    this.user = localStorage.getItem('user');
    let user = JSON.parse(this.user);
    this.userName = atob(user.userName) + ' ' + atob(user.surname);
  }

  imageProfile() {
    this.responseLocalStorage = localStorage.getItem('role');
    let img = JSON.parse(this.responseLocalStorage);
    if (img.image === undefined) {
      this.imgURL = null;
    } else {
      this.imgURL = `${this.API_URI}/public/static/img/user/${atob(img.image)}`;
    }
    console.log(this.imgURL);
  }

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }

    for (let item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return 'Dashboard';
  }

  logout() {
    this.authenticationService.logout();
  }
}
