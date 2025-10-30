import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import * as AOS from 'aos';
// import { ToastrService } from 'ngx-toastr';
import { ServiceProviderService } from '../../shares/service-provider.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { ToastrService } from 'ngx-toastr';
import { FooterComponent } from "../../footer/footer.component";
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-login-member',
  templateUrl: './login-member.component.html',
  styleUrls: ['./login-member.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, LottieComponent, FooterComponent,HeaderComponent,RouterModule],
})
export class LoginMemberComponent {
  deviceSize: string = '';
  modelAboutUs: any = {};
  sellerCode: string = '';
  showPassword = false;
  password: string = '';
  model: any = {};


  planngLottieOptions: AnimationOptions = {
    path: 'assets/animations/Login Leady.json',
    loop: true,
    autoplay: true,
  };

  constructor(
    private router: Router,
    private serviceProvider: ServiceProviderService,
    public toastr: ToastrService,
  ) { }

  isInfoResiger = false;

  ngOnInit(): void {
    AOS.init();
    this.model.sellerCode = '';
    this.model.password = '';
    // if (
    //   this.utilities.getUserLocalStorage().code != '' &&
    //   this.utilities.getUserLocalStorage().code != null
    // ) {
    //   this.router.navigate(['/user']);
    // }
  }

  gotoForm() {
    if (!this.isInfoResiger) {
      this.isInfoResiger = true;
      window.scroll(0, 0)
      return;
    }


    this.router.navigate(['register-form'], {
      // skipLocationChange: true,
    });
  }


  goLogin() {

    // if (this.model.sellerCode == '' || this.model.sellerCode == undefined) {
    //   this.toastr.warning('กรุณากรอก username', 'แจ้งเตือนระบบ', {
    //     timeOut: 5000,
    //   });
    //   return;
    // }

    // if (this.model.password == '' || this.model.password == undefined) {
    //   this.toastr.warning('กรุณากรอก password', 'แจ้งเตือนระบบ', {
    //     timeOut: 5000,
    //   });
    //   return;
    // }
    this.router.navigate(['license-register'], {
    });
  }

  login() {

    if (this.model.sellerCode == 'admin' && this.model.password) {
      this.router.navigate(['user-admin'], {
        // skipLocationChange: true,
      });
      return;
    }

    if (this.model.sellerCode == '' || this.model.sellerCode == undefined) {
      this.toastr.warning('กรุณากรอก username', 'แจ้งเตือนระบบ', {
        timeOut: 5000,
      });
      return;
    }

    if (this.model.password == '' || this.model.password == undefined) {
      this.toastr.warning('กรุณากรอก password', 'แจ้งเตือนระบบ', {
        timeOut: 5000,
      });
      return;
    }

    this.serviceProvider
      .post('vendorRegister/login', { sellerCode: this.model.sellerCode, password: this.model.password })
      .subscribe({
        next: (res) => {
          let model: any = [];
          model = res;
          if (model.status == 'S') {
            localStorage.setItem('code', model?.objectData?.code);
            localStorage.setItem('email', model?.objectData?.sellerCode);

            this.router.navigate(['user'], {
              // skipLocationChange: true,
            });
          } else {

            this.toastr.error(model.message, 'แจ้งเตือนระบบ', {
              timeOut: 10000,
              titleClass: 'toast-msg',
              messageClass: 'toast-msg'
            });

          }
        },
        error: (err) => {


          this.toastr.error(err.message, 'แจ้งเตือนระบบ', {
            // positionClass: 'toast-center-center',
            timeOut: 10000,
            titleClass: 'toast-msg',
            messageClass: 'toast-msg'
          });
        }
      }
      );
  }




  readAboutMe() {
    this.serviceProvider.post('m/aboutUs/read', {}).subscribe((data) => {
      let model: any = {};
      model = data;
      this.modelAboutUs = model.objectData;
    });
  }

  downloadRegisForm() {
    (this.modelAboutUs.membershipApplication ?? '') != ''
      ? window.open(this.modelAboutUs.membershipApplication, '_blank')
      : null;
  }
}
