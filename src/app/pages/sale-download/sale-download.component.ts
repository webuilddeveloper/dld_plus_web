import { Component, OnInit } from '@angular/core';
import { DateFormatPipe } from '../../date-format.pipe';
import { FooterComponent } from '../../footer/footer.component';
import { HeaderComponent } from '../../header/header.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServiceProviderService } from '../../shares/service-provider.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sale-download',
  templateUrl: './sale-download.component.html',
  styleUrls: ['./sale-download.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent
],
})
export class SaleDownloadComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public serviceProviderService: ServiceProviderService,
  ) { }
  documentList = [
    {
      title: "TOR ระบบจัดการ License",
      type: "pdf",
      description: "รายละเอียด TOR สำหรับการจัดซื้อโปรแกรมระบบจัดการ License",
      updateDate: "2025-10-01",
      fileUrl: "assets/docs/tor-license.pdf"
    },
    {
      title: "ใบเสนอราคา Software",
      type: "pdf",
      description: "ตัวอย่างใบเสนอราคาสำหรับหน่วยงานราชการ",
      updateDate: "2025-09-28",
      fileUrl: "assets/docs/quotation.pdf"
    },
    {
      title: "แบบฟอร์มคำขอ",
      type: "doc",
      description: "เอกสารสำหรับติดต่อเจ้าหน้าที่เพื่อดำเนินการจัดซื้อ",
      updateDate: "2025-09-25",
      fileUrl: "assets/docs/request.doc"
    },
    {
      title: "ข้อมูลประกอบการขาย (ZIP)",
      type: "zip",
      description: "รูปภาพและเอกสารประกอบโครงการทั้งหมด",
      updateDate: "2025-09-20",
      fileUrl: "assets/docs/sales-support.zip"
    }
  ];

  ngOnInit(): void {}

  downloadFile(doc: any) {
    window.open(doc.fileUrl, "_blank");
  }

    goBack() {
    // window.history.back();
    this.router.navigate(['user']);
  }
}
