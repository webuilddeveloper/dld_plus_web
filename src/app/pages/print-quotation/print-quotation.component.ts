import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren, ViewChild, Renderer2, OnInit } from '@angular/core';
import { gsap } from 'gsap';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ServiceProviderService } from '../../shares/service-provider.service';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { ToastrService } from 'ngx-toastr';
import * as AOS from 'aos';
import html2pdf from 'html2pdf.js';
import { DateFormatPipe } from "../../date-format.pipe";

interface Item {
  no: number;
  code?: string;
  description: string;
  qty: number;
  unitPrice: number;
  discount?: number;
  vatPercent?: number;
}

@Component({
  selector: 'app-print-quotation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DateFormatPipe],
  templateUrl: './print-quotation.component.html',
  styleUrls: ['./print-quotation.component.css'],
})
export class PrintQuotationComponent implements OnInit {
  constructor(private fb: FormBuilder, private toastr: ToastrService, private router: Router, public serviceProviderService: ServiceProviderService, private activatedRoute: ActivatedRoute,
  ) { }

  @ViewChild('poContent') poContent!: ElementRef;

  company: any = {};

  model: any = {};

  vendor: any = {
  };

  items: any = [];
  role: any = "";

  isAdmin: any = false;


  ngOnInit(): void {

    this.role = localStorage.getItem('role');
    this.activatedRoute.queryParams.subscribe((params) => {
      let temp = JSON.parse(params['model']);
      this.items.push(temp);
      if (temp.package != "" && temp.package != null) {
        switch (temp.package) {
          case 'Basic':
            temp.price = 18000;
            break;
          case 'Enterprise':
            temp.price = 80000;
            break;
          case 'Organize':
            temp.price = 150000;
            break;
          default:
            temp.price = 0;
            break;
        }
      }

      if (this.role == "admin") {
        this.calReadAdmin(temp);
      } else {
        this.readVendor(temp);
      }


      // this.model = JSON.parse(params['model']);

      // this.items.push(this.model);
      // this.readVendor();
    });

  }

 readVendor(param: any) {
    this.company = {
      name: 'บริษัท วี บิลด์ แอนด์ โอเปอร์เรต จำกัด',
      address: '19/1-2 อาคารวังเด็ก 2 ชั้น 8 ซ.ยาสูบ1 ถ.วิภาวดีรังสิต แขวงจอมพล เขตจตุจักร กรุงเทพมหานคร 10900',
      tel: '02-272-2575',
      email: 'support@webuild.co.th',
      website: 'https://www.webuild.co.th/',
    };

    this.serviceProviderService.post("vendorRegister/read", { "sellerCode": param.sellerCode }).subscribe(
      (data) => {
        let temp: any = {};
        temp = data;
        this.vendor = temp.objectData[0];

        this.model = {
          name: this.vendor.companyName,
          address: this.vendor.addressLine,
          tel: this.vendor.phone,
          email: this.vendor.email,
          website: this.vendor.website,
          taxId: this.vendor.taxId,
          poCode: param.poCode,
          createDate: param.createDate,
          description: param.description,
          endUserEmail: param.companyEmail,
          endUserPhone: param.companyPhone,
        };
      },
      (err) => {
      }
    );
  }

  calReadAdmin(param: any) {
    this.isAdmin = true;
    this.model = {
      name: 'บริษัท วี บิลด์ แอนด์ โอเปอร์เรต จำกัด',
      address: '19/1-2 อาคารวังเด็ก 2 ชั้น 8 ซ.ยาสูบ1 ถ.วิภาวดีรังสิต แขวงจอมพล เขตจตุจักร กรุงเทพมหานคร 10900',
      tel: '02-272-2575',
      email: 'support@webuild.co.th',
      website: 'https://www.webuild.co.th/',
      poCode: param.poCode,
      createDate: param.createDate,
      description: param.description,
      endUserEmail: param.companyEmail,
      endUserPhone: param.companyPhone,
    };

    this.company = {
      name: 'บริษัท Mode Solutions',
      address: '1078/1 หมู่ 4 ถนนแสงชูโต ตำบลท่าม่วง อำเภอท่าม่วง จังหวัดกาญจนบุรี 71110',
      tel: '034-604645 , 062 - 5988225',
      email: 'info.modesolutions@gmail.com',
      website: 'https://www.modesolutions.co.th',
    };

  }

  exportPDF() {
    const opt = {
      margin: [0.4, 0.4],
      filename: 'purchase_order.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(this.poContent.nativeElement).set(opt as any).save();
  }

get subtotal() {
    return this.items.reduce((s: number, it: any) => {
      const vatRate = (it.vatPercent ?? 7) / 100;
      const priceBeforeVat = it.price / (1 + vatRate);
      return s + priceBeforeVat;
    }, 0);
  }

  get totalVat() {
    return this.items.reduce((s: number, it: any) => {
      const vatRate = (it.vatPercent ?? 7) / 100;
      const vatAmount = (it.price / (1 + vatRate)) * vatRate;
      return s + vatAmount;
    }, 0);
  }

  get total() {
    return this.subtotal + this.totalVat;
  }
  print() {
    window.print();
  }


  goBack() {
    if (this.role == 'admin') {
      this.router.navigate(['license-manage']);
    } else {
      this.router.navigate(['sale-purchase-order']);
    }
  }

}