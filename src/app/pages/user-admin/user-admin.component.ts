import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { ServiceProviderService } from '../../shares/service-provider.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LottieComponent } from 'ngx-lottie';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
  ],
})
export class UserAdminComponent implements OnInit {
  constructor(
    private router: Router,
    private serviceProvider: ServiceProviderService
  ) {}

  ngOnInit(): void {
    AOS.init({
      offset: 120,
      duration: 800,
      easing: 'ease-in-out-sine',
      delay: 100,
      once: false,
    });
  }

  goTo(page: string) {
    if (page === 'dashboard') {
      this.router.navigate(['dashboard'], {
        queryParams: {  type: 'admin' },
      });
    } else if (page === 'manage') {
      this.router.navigate(['sale-manage']);
    } else if (page === 'license-manage') {
      this.router.navigate(['license-manage']);
    }
  }
}
