import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { ServiceProviderService } from '../../shares/service-provider.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DateFormatPipe } from '../../date-format.pipe';
import { ExcelService } from '../../shares/excel.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-sale-history',
  templateUrl: './sale-history.component.html',
  styleUrls: ['./sale-history.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
    DateFormatPipe,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
],
})
export class SaleHistoryComponent {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public serviceProviderService: ServiceProviderService,
    private excelService: ExcelService
  ) { }
  seller = { name: 'อดิศร แสงสว่าง', code: 'EMP-045' };
  isClosing = false;
  tempList: any = [];
  tempLicense: any = [];

  salesList = [
    {
      organization: 'อบต. หนองน้ำใส',
      province: 'นครราชสีมา',
      totalLicenses: 5,
      saleDate: new Date(),
      licenses: [
        {
          key: 'ABC-123-C3-1112',
          status: 'Active',
          activatedDate: '01/09/2025',
          expiryDate: '01/09/2026',
        },
        {
          key: 'ABC-124-A1-0550',
          status: 'Pending',
          activatedDate: null,
          expiryDate: null,
        },
      ],
    },
    {
      organization: 'อบจ. ขอนแก่น',
      province: 'ขอนแก่น',
      totalLicenses: 3,
      saleDate: new Date(),
      licenses: [
        {
          key: 'XYZ-999-XX-0091',
          status: 'Active',
          activatedDate: '02/10/2025',
          expiryDate: '02/10/2026',
        },
      ],
    },
  ];

  selectedSale: any = null;
  searchTerm = '';
  searchSales = '';
  filteredLicenses: any[] = [];
  paginatedLicenses: any[] = [];
  filteredSales: any[] = [];
  paginatedSales: any[] = [];
  criteriaModel: any = {
    keySearch: '',
    status: '',
  };

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  currentSalePage = 1;
  saleItemsPerPage = 10;
  totalSalePages = 1;

  vendorRegisterCode = '';
  model: any = {};
  listLicenseRegister: any = [];
  listLicenseKey: any = [];

  ngOnInit() {
    (this.vendorRegisterCode = localStorage.getItem('sellerCode') ?? ''),
      // this.updateSalePagination();
      this.callRead();
  }

  openDrawer(sale: any) {
    this.selectedSale = sale;
    this.serviceProviderService
      .post('License/read', { orderCode: this.selectedSale.orderCode })
      .subscribe(
        (data) => {
          let temp: any = {};
          temp = data;
          this.tempLicense = temp.objectData;
          this.listLicenseKey = this.tempLicense;
        },
        (err) => { }
      );
    // this.updatePagination();
    document.body.classList.add('drawer-open');
  }

  closeDrawer() {
    this.isClosing = true;
    setTimeout(() => {
      this.selectedSale = null;
      this.isClosing = false;
      document.body.classList.remove('drawer-open');
    }, 300);
  }

  callRead() {
    this.serviceProviderService
      .post('vendorRegister/read', { sellerCode: this.vendorRegisterCode })
      .subscribe(
        (data) => {
          let temp: any = {};
          temp = data;
          this.model = temp.objectData[0];
          this.callReadLicenseRegister();
        },
        (err) => { }
      );
  }

  callReadLicenseRegister() {
    this.serviceProviderService
      .post('LicenseRegister/read', { sellerCode: this.model.sellerCode })
      .subscribe(
        (data) => {
          let temp: any = {};
          temp = data;
          this.tempList = temp.objectData;
          this.listLicenseRegister = this.tempList;
          this.updateSalePagination();
        },
        (err) => { }
      );
  }

  filterLicenses() {
    const term = this.searchTerm.toLowerCase();
    this.filteredLicenses = this.tempLicense.filter((l: any) =>
      l.licenseKey.toLowerCase().includes(term)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(
      this.filteredLicenses.length / this.itemsPerPage
    );
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedLicenses = this.filteredLicenses.slice(
      start,
      start + this.itemsPerPage
    );
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  // filterSales() {
  //   const term = this.searchSales.toLowerCase();
  //   this.listLicenseRegister = this.tempList.filter(
  //     (s: any) =>
  //       s.orderCode.toLowerCase().includes(term) ||
  //       s.poCode.toLowerCase().includes(term) ||
  //       s.licenseCode.toLowerCase().includes(term) ||
  //       s.companyName.toLowerCase().includes(term) ||
  //       s.program.toLowerCase().includes(term) ||
  //       s.package.toLowerCase().includes(term) ||
  //       s.licenseCount.toString().toLowerCase().includes(term)

  //   );
  //   this.currentSalePage = 1;
  //   this.updateSalePagination();
  // }

  filterSales() {
    const term = this.criteriaModel.keySearch.toLowerCase();
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มจาก 0
    const day = String(now.getDate()).padStart(2, '0');
    const dateNow = `${year}${month}${day}`;
    const start = this.criteriaModel.startDate != undefined ? this.criteriaModel.startDate.replace(/-/g, "") : dateNow;
    const end = this.criteriaModel.endDate != undefined ? this.criteriaModel.endDate.replace(/-/g, "") : dateNow;
    this.listLicenseRegister = this.tempList.filter(
      (s: any) =>
        (s.orderCode.toLowerCase().includes(term) ||
        s.poCode.toLowerCase().includes(term) ||
        s.licenseCode.toLowerCase().includes(term) ||
        s.companyName.toLowerCase().includes(term) ||
        s.program.toLowerCase().includes(term) ||
        s.package.toLowerCase().includes(term) ||
        s.licenseCount.toString().toLowerCase().includes(term)) && (s.createDate.substring(0, 8) >= start && s.createDate.substring(0, 8) <= end)

    );
    this.currentSalePage = 1;
    this.updateSalePagination();
  }


  updateSalePagination() {
    this.totalSalePages = Math.ceil(
      this.listLicenseRegister.length / this.saleItemsPerPage
    );
    const start = (this.currentSalePage - 1) * this.saleItemsPerPage;
    this.paginatedSales = this.listLicenseRegister.slice(
      start,
      start + this.saleItemsPerPage
    );
  }

  nextSalePage() {
    if (this.currentSalePage < this.totalSalePages) {
      this.currentSalePage++;
      this.updateSalePagination();
    }
  }
  prevSalePage() {
    if (this.currentSalePage > 1) {
      this.currentSalePage--;
      this.updateSalePagination();
    }
  }

  goBack() {
    // window.history.back();
    this.router.navigate(['user']);
  }

  exportAsXLSX(): void {
    const data = { model: JSON.stringify(this.selectedSale) };
    this.router.navigate(['license-print'], {
      queryParams: data,
      skipLocationChange: true,
    });


    // let result: any = [];

    // this.listLicenseKey.forEach(
    //   (e: { order: any; licenseKey: any }, index: any) => {
    //     result.push({
    //       ลำดับ: index + 1,
    //       LicenseKey: e.licenseKey,
    //     });
    //   }
    // );
    // this.excelService.exportAsExcelFile(result, 'license_key');
  }

  goToLicenseRegister() {
    this.router.navigate(['license-register-user']);
    return;
  }
}
