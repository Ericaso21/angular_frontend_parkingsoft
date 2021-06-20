import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styles: [],
})
export class TemplateComponent implements OnInit {
  constructor(private athenticationServices: AuthenticationService) {}

  ngOnInit(): void {
    this.athenticationServices.sessionExpired;
  }
}
