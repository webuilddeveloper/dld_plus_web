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

  company = {
    name: 'บริษัท We-LAP',
    address: 'ห้องเลขที่ ถนน กาญจนาภิเษก แขวง บางแค เขตบางแค กรุงเทพมหานคร 10160',
    tel: '1485',
    email: 'we-lap@mail.com',
    website: 'www.we-lap.co.th',
    taxId: '0105556133378'
  };

  model: any = {};

  vendor: any = {
  };

  items: any = [];



  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.model = JSON.parse(params['model']);
      if (this.model.package != "" && this.model.package != null) {
        switch (this.model.package) {
          case 'Basic':
            this.model.price = 18000;
            break;
          case 'Enterprise':
            this.model.price = 80000;
            break;
          case 'Organize':
            this.model.price = 150000;
            break;
          default:
            this.model.price = 0;
            break;
        }
      }
      this.items.push(this.model);
      this.readVendor();
    });

  }

  readVendor() {
    this.serviceProviderService.post("vendorRegister/read", { "sellerCode": this.model.sellerCode }).subscribe(
      (data) => {
        let temp: any = {};
        temp = data;
        this.vendor = temp.objectData[0];
      },
      (err) => {
      }
    );
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
    return this.items.reduce((s: any, it: any) => s + it.price, 0);
  }

  get totalVat() {
    return this.items.reduce((s: any, it: any) => {
      const line = it.price * ((it.vatPercent ?? 7) / 100);
      return s + line;
    }, 0);
  }

  get total() {
    return this.subtotal + this.totalVat;
  }

  print() {
    window.print();
  }

  goBack() { this.router.navigate(['sale-purchase-order']); }

}