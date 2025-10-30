import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DateFormatPipe } from "../../date-format.pipe";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceProviderService } from '../../shares/service-provider.service';
import dayjs from 'dayjs';

@Component({
  selector: 'app-license-print',
  templateUrl: './license-print.component.html',
  styleUrls: ['./license-print.component.css'],
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,]
})
export class LicensePrintComponent {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public serviceProviderService: ServiceProviderService,
  ) { }

  tempLicense: any = [];
  listLicenseKey: any = [];
  model: any = {};
  modelVendor: any = {};
  startDate: any = "";
  endDate: any = "";


  // model = {
  //   transactionType: 'VAD - Standard Support Service',
  //   duration: '1 Year and 10 Months',
  //   period: '27 Nov 2023 to 26 Sep 2025',
  //   orderNumber: '41227900',
  //   issuedBy: 'Oracle Thailand',

  //   endUser: {
  //     company: 'Office of the Permanent Secretary, Ministry of Labour',
  //     contact: 'Miss Pongpan Khunnarat',
  //     email: 'pongpurn.k@mol.mail.go.th',
  //     phone: '093-9091699',
  //     address: 'Mitmaitri Road, Dindaeng, Bangkok 10400'
  //   },

  //   partner: {
  //     company: 'Nextech Asia Co.,Ltd.',
  //     contact: 'Artcharapat Bunmemechai',
  //     email: 'artchara@nextech-asia.com',
  //     phone: '02-1502740',
  //     address: '49/13-14 Moo 9 Prachchuen Bangtalat, Pakkret Nonthaburi 11120'
  //   },

  //   licenses: [
  //     '0R61-76SS-FJBG-BZM7'
  //   ]
  // };

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.model = JSON.parse(params['model']);
      this.startDate = dayjs(this.model.updateDate, 'YYYYMMDDHHmmss');
      this.endDate = this.startDate.add(1, 'year').subtract(1, 'day');
      this.model.period = this.startDate.format('DD MMM YYYY') + ' to ' + this.endDate.format('DD MMM YYYY');

      this.callRead();
      this.callReadVendor();
    });

  }

  callRead() {
    this.serviceProviderService
      .post('License/read', { orderCode: this.model.orderCode })
      .subscribe(
        (data) => {
          let temp: any = {};
          temp = data;
          this.tempLicense = temp.objectData;
          this.listLicenseKey = this.tempLicense;
        },
        (err) => { }
      );
  }

  callReadVendor() {
    this.serviceProviderService
      .post('vendorRegister/read', { "sellerCode": this.model.sellerCode })
      .subscribe(
        (data) => {
          let temp: any = {};
          temp = data;
          this.modelVendor = temp.objectData[0];
        },
        (err) => { }
      );
  }

    goBack() { this.router.navigate(['sale-history']); }


  async printPDF() {
    const content = document.getElementById('license-content');
    if (!content) return;

    const canvas = await html2canvas(content, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('License_Certificate.pdf');
  }
}