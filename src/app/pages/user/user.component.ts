import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { ServiceProviderService } from '../../shares/service-provider.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LottieComponent } from 'ngx-lottie';
import { FooterComponent } from "../../footer/footer.component";
import { HeaderComponent } from "../../header/header.component";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FooterComponent, HeaderComponent],

})
export class UserComponent implements OnInit {

  constructor(
    private router: Router,
    private serviceProvider: ServiceProviderService,
  ) { }



  ngOnInit(): void {
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
      this.router.navigate(['dashboard']);
    } else if (page === 'history') {
      this.router.navigate(['sale-history']);
    } else if (page === 'sale-purchase-order') {
      this.router.navigate(['sale-purchase-order']);
    }  else if (page === 'download') {
      this.router.navigate(['sale-download']);
    }
  }
}
