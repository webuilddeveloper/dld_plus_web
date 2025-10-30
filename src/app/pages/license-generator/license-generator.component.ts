import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren, ViewChild, Renderer2, OnInit } from '@angular/core';
import { gsap } from 'gsap';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ServiceProviderService } from '../../shares/service-provider.service';
import { FooterComponent } from "../../footer/footer.component";
import { HeaderComponent } from "../../header/header.component";
import { ToastrService } from 'ngx-toastr';
import { DateFormatPipe } from "../../date-format.pipe";


@Component({
  selector: 'app-license-register',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, HeaderComponent, DateFormatPipe],
  templateUrl: './license-generator.component.html',
  styleUrls: ['./license-generator.component.css'],
})
export class LicenseGeneratorComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public serviceProviderService: ServiceProviderService,
    private toastr: ToastrService,
  ) { }
  seller = { code: 'EMP-045' };
  org = {
    name: 'อบต. หนองน้ำใส',
    totalLicenses: 5,
    documentUrl: 'https://www.example.com/license-doc.pdf',
    price: 12500
  };


  data: any = {};
  model: any = {};
  listLicensKey: any = [];

  startDate = new Date();
  endDate = new Date();
  licenses: any[] = [];

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.data = params;
      this.callRead();
    });
    // ตั้งวันหมดอายุ (1 ปีจากปัจจุบัน)
    this.endDate.setFullYear(this.startDate.getFullYear() + 1);
  }

  generateLicenses1() {
    this.licenses = [];
    for (let i = 0; i < 3; i++) {
      this.licenses.push({
        key: this.randomLicenseKey(),
        status: 'Pending',
        createdDate: new Date()
      });
    }
  }



  callRead() {
    this.serviceProviderService.post("LicenseRegister/read", { "code": this.data.code }).subscribe(
      (data) => {
        let temp: any = {};
        temp = data;
        this.model = temp.objectData[0];
        // this.callReadLicenseKey();
      },
      (err) => {
      }
    );
  }

  // callReadLicenseKey() {
  //   this.serviceProviderService.post("License/read", this.model).subscribe(
  //     (data) => {
  //       let temp: any = {};
  //       temp = data;
  //       this.model = temp.objectData;
  //     },
  //     (err) => {
  //     }
  //   );
  // }

  generateLicenses() {
    let payload = {
      "orderCode": this.model.code,
      "sellerCode": this.model.sellerCode,
      "program": this.model.program,
      "licenseCount": this.model.licenseCount
    }
    this.serviceProviderService.post("License/generate", payload).subscribe(
      (data) => {
        let temp: any = {};
        temp = data;
        this.listLicensKey = temp.objectData;
      },
      (err) => {
      }
    );
  }

  randomLicenseKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = '';
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) key += '-';
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  }

  copyLicense(key: string) {
    navigator.clipboard.writeText(key);
  }

  viewDetail(lic: any) {
    alert(`รายละเอียด License:\nKey: ${lic.key}\nสถานะ: ${lic.status}`);
  }
  goBack() { this.router.navigate(['license-manage']); }

}