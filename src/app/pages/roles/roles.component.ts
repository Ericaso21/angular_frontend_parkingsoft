import { Component, OnInit } from '@angular/core';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styles: [
  ]
})
export class RolesComponent implements OnInit {
  roles: any;
  constructor(private rolesService: RolesService, private recaptchaV3Service: ReCaptchaV3Service) { }

  ngOnInit(): void {
    this.recaptchaV3Service.execute('action').subscribe(
      (token) => {
        console.log(token);
        this.getRoles(token);
      },
      (error: any) => {
        console.log(error);
      }
    )
    
  }

  getRoles(token: any){
    this.rolesService.getRoles(token).subscribe(
      (res: any) => {
        this.roles = res;
        console.log(this.roles);
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

}
