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
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
})
export class SaleDownloadComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public serviceProviderService: ServiceProviderService
  ) {}
  documentList = [
    {
      title: '1_TOR ระบบแผนพัฒนาท้องถิ่นดิจิทัลพลัส (Digital Local D)',
      type: 'pdf',
      description:
        'รายละเอียด 1_TOR ระบบแผนพัฒนาท้องถิ่นดิจิทัลพลัส (Digital Local D)',
      updateDate: '2025-10-01',
      fileUrl:
        'https://dldsoftplus.com/docs/03.1_TOR ระบบแผนพัฒนาท้องถิ่นดิจิทัลพลัส (Digital Local D.docx',
    },
    {
      title: 'บันทึกข้อความขออนุมัติ',
      type: 'pdf',
      description: 'รายละเอียด บันทึกข้อความขออนุมัติ',
      updateDate: '2025-09-28',
      fileUrl: 'https://dldsoftplus.com/docs/03.2_บันทึกข้อความขออนุมัติ.docx',
    },
    {
      title: 'ใบเสนอราคา',
      type: 'doc',
      description: 'รายละเอียดใบเสนอราคา',
      updateDate: '2025-09-25',
      fileUrl: 'https://dldsoftplus.com/docs/03.3_ใบเสนอราคา.docx',
    },
    {
      title: 'เอกสารแนะนำระบบแผนพัฒนาท้องถิ่นดิจิทัลพลัส (DLD+)',
      type: 'zip',
      description:
        'รายละเอียด เอกสารแนะนำระบบแผนพัฒนาท้องถิ่นดิจิทัลพลัส (DLD+)',
      updateDate: '2025-10-30',
      fileUrl: 'https://dldsoftplus.com/docs/CatalogSmartPlan.pdf',
    },
  ];

  ngOnInit(): void {}

  downloadFile(doc: any) {
    window.open(doc.fileUrl, '_blank');
  }

  goBack() {
    // window.history.back();
    this.router.navigate(['user']);
  }
}
