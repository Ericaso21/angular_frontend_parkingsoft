import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { ROUTES } from '../sidebar/sidebar.component';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit {
  public focus: any;
  public listTitles: any[] = [];
  public location: Location;
  constructor(location: Location) { 
    this.location = location;
  }

  ngOnInit(): void {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
  }

  getTitle(){
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

}
