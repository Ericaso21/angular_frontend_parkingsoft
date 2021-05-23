import { Component, Inject, OnChanges, OnInit } from '@angular/core';
import { DOCUMENT, Location } from '@angular/common';
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
  imgURL: any;
  responseLocalStorage: any;
  private API_URI = API_URI.url;

  constructor(
    location: Location,
    public authenticationService: AuthenticationService,
    @Inject(DOCUMENT) private _document: Document
  ) {
    this.location = location;
  }

  refreshPage() {
    this._document.defaultView?.location.reload();
  }

  ngOnInit(): void {
    this.getUserdata();
    this.listTitles = ROUTES.filter((listTitle) => listTitle);
  }

  public UpdateUserData() {
    let userData = this.authenticationService.getUserData();
    if (userData !== null) {
      if (userData.name_file === null || userData.name_file === undefined) {
        this.imgURL = null;
      } else {
        this.imgURL = `${this.API_URI}/public/static/img/user/${userData.name_file}`;
      }
      this.user = userData;
    }
  }

  public getUserdata() {
    let userData = this.authenticationService.getUserData();
    if (userData !== null) {
      if (userData.name_file === null || userData.name_file === undefined) {
        this.imgURL = null;
      } else {
        this.imgURL = `${this.API_URI}/public/static/img/user/${userData.name_file}`;
      }
      this.user = userData;
    }
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
