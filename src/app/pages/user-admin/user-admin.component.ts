import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ServiceProviderService } from '../../shares/service-provider.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LottieComponent } from 'ngx-lottie';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { filter } from 'rxjs/operators';
import { AosService } from '../../shares/aos.service';
import * as AOS from 'aos';


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
    private serviceProvider: ServiceProviderService,
    private aos: AosService
  ) { }

  ngOnInit(): void {
    // Init ปกติ
    setTimeout(() => {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: false,
        mirror: true,
      });
      AOS.refresh();
    }, 100);
  }


  goTo(page: string) {
    if (page === 'dashboard') {
      this.router.navigate(['dashboard'], {
        queryParams: { type: 'admin' },
      });
    } else if (page === 'manage') {
      this.router.navigate(['sale-manage']);
    } else if (page === 'license-manage') {
      this.router.navigate(['license-manage']);
    }
  }
}
