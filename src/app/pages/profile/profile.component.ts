import { Component, OnInit } from '@angular/core';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { UserService } from 'src/app/services/user.service';
import { API_URI } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [],
})
export class ProfileComponent implements OnInit {
  userProfile: any;
  email: any;
  profile: any = {};
  edit: boolean = false;
  imgURL: any;
  fileImage: any;
  private API_URI = API_URI.url;
  public message: string | undefined;
  userProfileSave: any = {
    token: '',
    document_number: '',
    first_name: '',
    second_name: '',
    surname: '',
    second_surname: '',
    name_user: '',
    address: '',
    email: '',
    telephone: '',
  };
  constructor(
    private userService: UserService,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {}

  ngOnInit(): void {
    this.getUserProfile();
    this.getUserFrom();
  }

  preview(files: any) {
    if (files.length === 0) return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Only images are supported.';
      return;
    }

    var reader = new FileReader();
    this.fileImage = files[0];
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
    this.updateImageprofile(this.fileImage);
  }

  getEmail() {
    this.email = localStorage.getItem('role');
    let email = JSON.parse(this.email);
    return atob(email.email);
  }

  updateImageprofile(file: any) {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.userService
        .updateUserProfileImage(
          file,
          token,
          this.userProfileSave.document_number
        )
        .subscribe(
          (res: any) => {
            console.log(res);
          },
          (error: any) => {
            console.log(error);
          }
        );
    });
  }

  getUserProfile() {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      const email = this.getEmail();
      this.userService.getUserProfile(token, email).subscribe(
        (res: any) => {
          if (res.name_file == null) {
            console.log('No exist image');
          } else {
            this.imgURL = `${this.API_URI}/public/static/img/user/${res.name_file}`;
          }
          this.profile = res;
        },
        (error: any) => {
          console.log(error);
        }
      );
    });
  }

  getUserFrom() {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      const email = this.getEmail();
      this.userService.getUserProfile(token, email).subscribe(
        (res: any) => {
          this.userProfileSave = res;
        },
        (error: any) => {
          console.log(error);
        }
      );
    });
  }
  saveProfile() {
    this.recaptchaV3Service.execute('action').subscribe((token) => {
      this.userProfileSave.token = token;
      if (this.userProfileSave.first_name.split(' ')[1] == undefined) {
        delete this.userProfileSave.second_name;
      } else {
        this.userProfileSave.second_name =
          this.userProfileSave.first_name.split(' ')[1];
      }
      if (this.userProfileSave.surname.split(' ')[1] == undefined) {
        delete this.userProfileSave.second_surname;
      } else {
        this.userProfileSave.second_surname =
          this.userProfileSave.surname.split(' ')[1];
      }
      this.userProfileSave.first_name =
        this.userProfileSave.first_name.split(' ')[0];
      this.userProfileSave.surname = this.userProfileSave.surname.split(' ')[0];
      fetch(this.imgURL)
        .then((res) => res.blob())
        .then((res) => (this.userProfileSave.photo_user = res));
      console.log(this.userProfileSave.photo_user);
      this.userService
        .updateUserProfile(
          this.userProfileSave,
          this.userProfileSave.document_number
        )
        .subscribe(
          (res: any) => {
            if (res['status']) {
              Swal.fire('¡Perfil!', res['message'], 'success');
              this.edit = false;
            }
          },
          (error: any) => {
            console.log(error);
          }
        );
    });
  }
}
