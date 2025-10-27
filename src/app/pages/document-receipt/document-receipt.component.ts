import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SidebarComponent } from "../../sidebar/sidebar.component";
import { PdfService } from "../../shares/pdf.service";

@Component({
  selector: "app-document-receipt",
  templateUrl: "./document-receipt.component.html",
  styleUrls: ["./document-receipt.component.css"],
  imports: [SidebarComponent],
})
export class DocumentReceiptComponent implements OnInit {
  reference: string = "";
  jobType: string = "";
  editModel: any = {}; // model for dialog
  number: string = "";
  date: string = "";
  isShow: boolean = false;
  model: any = {};
  userModel: any = {};
  txtPrice: string = "";
  toDate: String = "";
  payDate: String = "";
  startDate: String = "";
  endDate: String = "";
  formData: any;
  durationTime: any;
  total: String = "";
  vat: String = "";
  grandTotal: String = "";

  domainName = 'suksapanmall.com';
  price = 429.91;
  vatRate = 0.07;
  credit = 0.0;

  @ViewChild('receipt', { static: false }) receiptRef!: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private pdfService: PdfService,

  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.model = params;
    });
    this.read();
  }

  read() {
    this.durationTime = this.model.duration == '1y' ? '1 ปี' : '1 เดือน';

    this.calculateDates();
    this.calculateTotal();

  }
  print() {
    setTimeout(() => {
      window.print();
      // let data = document.getElementById("contentToConvert");
      // this.pdfService.generatePdf(data, "OpenPDF", "open");
      const element = this.receiptRef.nativeElement;
      this.pdfService.generatePdf(element, "OpenPDF", "open");
    }, 500);
  }

  downloadPDF() {
    this.isShow = true;
    setTimeout(() => {
      // let data = document.getElementById("contentToConvert");
      // this.pdfService.generatePdf(data, "DownloadPDF", "Download");
      const element = this.receiptRef.nativeElement;
      this.pdfService.generatePdf(element, "OpenPDF", "open");
      this.isShow = false;
    }, 500);
  }

  get vatAmount() {
    return this.price * this.vatRate;
  }

  get totalAmount() {
    return this.price + this.vatAmount - this.credit;
  }

  formatDate(date: Date): string {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  }

  calculateDates() {
    const today = new Date();

    // วันนี้ + 10 วัน
    const plus10Days = new Date(today);
    plus10Days.setDate(plus10Days.getDate() + 10);

    // วันนี้ + 1 เดือน
    const plus1Month = new Date(today);
    plus1Month.setMonth(plus1Month.getMonth() + 1);

    // วันนี้ + 1 ปี
    const plus1Year = new Date(today);
    plus1Year.setFullYear(plus1Year.getFullYear() + 1);

    this.toDate = this.formatDate(today);
    this.payDate = this.formatDate(plus10Days);

    if (this.model.duration == '1y') {
      this.endDate = this.formatDate(plus1Year)
    } else {
      this.endDate = this.formatDate(plus1Month);
    }

  }

  calculateTotal() {
    // แปลง string เป็น number
    const pricePerPerson = 19500;
    const numPeople = parseInt(this.model.userCount);

    // คำนวณ
    const total = pricePerPerson * numPeople;
    const vat = total * 0.07;
    const grandTotal = total + vat;

    this.total = total.toLocaleString();       // format เป็น 58,500
    this.vat = vat.toLocaleString();           // format เป็น 4,095
    this.grandTotal = grandTotal.toLocaleString(); // format เป็น 62,595

  }
}