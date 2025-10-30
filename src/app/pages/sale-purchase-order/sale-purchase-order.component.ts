import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ServiceProviderService } from '../../shares/service-provider.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { DateFormatPipe } from "../../date-format.pipe";

@Component({
  selector: 'app-sale-purchase-order',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    DateFormatPipe
  ],
  templateUrl: './sale-purchase-order.component.html',
  styleUrl: './sale-purchase-order.component.scss',
})
export class SalePurchaseOrderComponent {
  submitting = signal(false);
  seller = { name: 'อดิศร แสงสว่าง', code: 'EMP-045' };
  isClosing = false;

  salesList: any[] = [];
  modelList: any = [];

  selectAll = false;
  btnDelete = false;

  model: any = {};
  listLicensKey: any = [];

  selectedSale: any = {
    sellerType: 'company',
    provinceCode: '',
    districtCode: '',
    subdistrictCode: '',
  };
  isDrawer = false;
  searchTerm = '';
  searchSales = '';
  criteriaModel: any = {
    keySearch: '',
    status: '',
  };

  filteredLicenses: any[] = [];
  paginatedLicenses: any[] = [];
  filteredSales: any[] = [];
  paginatedSales: any[] = [];
  provinceList: any[] = [];
  districtList: any[] = [];
  subDistrictList: any[] = [];

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  limit = 9999;

  currentSalePage = 1;
  saleItemsPerPage = 10;
  totalSalePages = 1;
  selectedIndex: number = 0;
  form!: FormGroup;
  showSuccessPopup = false;
  popupSuccessTitle = 'บันทึกข้อมูลเรียบร้อย';
  showErrorPopup = false;
  popupErrorMessage = '';
  isShowDeletePopup = false;
  sellerCode = "";

  constructor(
    private serviceProvider: ServiceProviderService,
    private router: Router
  ) { }

  ngOnInit() {
    // this.selectedSale = {};
    this.sellerCode = localStorage.getItem('sellerCode') ?? '';

    this.callRead();
  }



  printDocument(param: any, type: any) {
    this.callReadSale(param, (latestSale) => {
      if (!latestSale) {
        return;
      }

      if (type === "po") {
        const data = { model: JSON.stringify(param) };
        this.router.navigate(['print-po'], {
          queryParams: data,
          skipLocationChange: true,
        });
      }
      else if (type === "quote") {
        const data = { model: JSON.stringify(param) };
        this.router.navigate(['print-quotation'], {
          queryParams: data,
          skipLocationChange: true,
        });
      }
      else if (type === "appoint") {
        this.downloadPDF(param, latestSale);
      }
    });
  }

  callReadSale(param: any, callback: (data?: any) => void) {
    this.serviceProvider
      .post('vendorRegister/read', { sellerCode: param.sellerCode })
      .subscribe(
        (res) => {
          let model: any = res;
          if (model.status === 'S' && model.objectData?.length > 0) {
            const latestSale = model.objectData.find(
              (x: any) => x.sellerCode === param.sellerCode
            );
            callback(latestSale);
          } else {
            callback(null);
          }
        },
        (err) => {
          callback(null);
        }
      );
  }


  downloadPDF(param: any, latestSale: any) {

    let payload = {
      "appNo": param.orderCode,
      "reference": param.reference,
      "vendorName": latestSale.companyName,
      "vendorAddress": latestSale.addressLine,
      "endUserName": param.companyName,
      "endUserAddress": param.companyAdress,
    }

    this.serviceProvider
      .postReport('api/report/getReportAppointmentOfDealerLAP', payload)
      .subscribe(
        (data) => {
          let blob = new Blob([data], { type: 'application/pdf' });
          let url = window.URL.createObjectURL(blob);
          let pwa = window.open(url);
          if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
            alert('Please disable your Pop-up blocker and try again.');
          }
          // console.log("shopShowAllLength",this.shopShowAllLength);
        },
        (err) => {
        }
      );

  }


  goToLicenseRegister() {
    this.router.navigate(['license-register-user']);
    return;
  }

  goToPurchaseOrder(param: any) {
    this.router.navigate(['license-register-user-po'], {
      queryParams: { code: param.code },
    });
    return;
  }

  callRead() {
    this.serviceProvider
      .post('licenseRegister/read', {
        "sellerCode": this.sellerCode,
      })
      .subscribe(
        (data) => {
          let model: any = {};
          model = data;
          if (model.status == 'S') {
            this.modelList = model.objectData;
            this.filteredSales = [...this.modelList];
            this.updateSalePagination();
          }
        },
        (err) => { }
      );
  }




  createDrawer() {
    this.selectedSale = {
      sellerType: 'company',
      provinceCode: '',
      districtCode: '',
      subdistrictCode: '',
    };
    this.openDrawer(this.selectedSale);
  }

  openDrawer(sale: any) {
    this.selectedSale = sale;

    this.serviceProvider
      .post('LicenseRegister/read', { code: this.selectedSale.code })
      .subscribe(
        (data) => {
          let temp: any = {};
          temp = data;
          this.model = temp.objectData[0];
          this.generateLicenses();
        },
        (err) => { }
      );

    this.isDrawer = true;
  }

  generateLicenses() {
    let payload = {
      orderCode: this.model.code,
      sellerCode: this.model.sellerCode,
      program: this.model.program,
      licenseCount: this.model.licenseCount,
    };
    this.serviceProvider.post('License/read', payload).subscribe(
      (data) => {
        let temp: any = {};
        temp = data;
        this.listLicensKey = temp.objectData;
      },
      (err) => { }
    );
  }

  generateLicensesbutton() {
    let payload = {
      orderCode: this.model.code,
      sellerCode: this.model.sellerCode,
      program: this.model.program,
      licenseCount: this.model.licenseCount,
    };
    this.serviceProvider.post("License/generate", payload).subscribe(
      (data) => {
        let temp: any = {};
        temp = data;
        this.listLicensKey = temp.objectData;
      },
      (err) => {
      }
    );
  }

  closeDrawer() {
    this.isClosing = true;
    this.callRead();
    setTimeout(() => {
      this.selectedSale = null;
      this.isClosing = false;
      document.body.classList.remove('drawer-open');
      this.isDrawer = false;
    }, 300);
  }

  toggleAll() {
    this.salesList.forEach((item) => (item.selected = this.selectAll));
    this.btnDelete = this.selectAll;
  }

  // ✅ ถ้าเลือกครบทุกแถว → เช็กให้หัวตารางด้วย
  checkIfAllSelected() {
    let aaa = this.salesList.find((item) => item.selected);
    this.btnDelete =
      this.salesList.find((item) => item.selected) != undefined ? true : false;
    this.selectAll = this.salesList.every((item) => item.selected);
  }

  showDeletePopup() {
    this.isShowDeletePopup = true;
  }

  deleteItem() {
    this.isShowDeletePopup = false;
    let code = this.salesList
      .filter((item) => item.selected)
      .map((item) => item.code)
      .join(',');
    this.serviceProvider
      .post('/vendorRegister/delete', { code: code })
      .subscribe({
        next: (res) => {
          var data: any = res;
          if (data.status == 'S') {
            this.showSuccessPopup = true;
          } else {
            this.popupErrorMessage = data.message;
            this.showErrorPopup = true;
          }
        },
        error: (err) => {
          this.popupErrorMessage = err;
          this.showErrorPopup = true;
        },
      });
  }

  // filterSales() {
  //   const term = this.criteriaModel.keySearch.toLowerCase();
  //   this.filteredSales = this.salesList.filter(
  //     (s) =>
  //       s.poCode.toLowerCase().includes(term) ||
  //       s.sellerCode.toLowerCase().includes(term)
  //   );
  //   this.currentSalePage = 1;
  //   this.updateSalePagination();
  // }

  filterSales() {
    const term = this.criteriaModel.keySearch.toLowerCase();
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateNow = `${year}${month}${day}`;
    const start = this.criteriaModel.startDate != undefined ? this.criteriaModel.startDate.replace(/-/g, "") : "";
    const end = this.criteriaModel.endDate != undefined ? this.criteriaModel.endDate.replace(/-/g, "") : "";
    this.filteredSales = this.modelList.filter(
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

  // filterDate() {
  //   const now = new Date();
  //   const year = now.getFullYear();
  //   const month = String(now.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มจาก 0
  //   const day = String(now.getDate()).padStart(2, '0');
  //   const dateNow = `${year}${month}${day}`;
  //   const start = this.criteriaModel.startDate != undefined ? this.criteriaModel.startDate.replace(/-/g, "") : dateNow;
  //   const end = this.criteriaModel.endDate != undefined ? this.criteriaModel.endDate.replace(/-/g, "") : dateNow;
  //   this.filteredSales = this.modelList.filter((item: any) => item.createDate.substring(0, 8) >= start && item.createDate.substring(0, 8) <= end);

  //   this.currentSalePage = 1;
  //   this.updateSalePagination();
  // }

  updateSalePagination() {
    this.totalSalePages = Math.ceil(
      this.filteredSales.length / this.saleItemsPerPage
    );
    const start = (this.currentSalePage - 1) * this.saleItemsPerPage;
    this.paginatedSales = this.filteredSales.slice(
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
    this.router.navigate(['user']);
  }

  toggleApprove(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedSale.status = checked ? 'A' : 'N';
  }

  submit(form: NgForm) {
    if (form.valid && !this.thaiIdValidator(this.selectedSale.taxId)) {
      this.submitting.set(true);

      const selectedP = this.provinceList.find(
        (p) => p.code === this.selectedSale.provinceCode
      );
      if (selectedP) {
        this.selectedSale.provinceCode = selectedP.code;
        this.selectedSale.province = selectedP.title;
      }

      const selectedD = this.districtList.find(
        (p) => p.code === this.selectedSale.districtCode
      );
      if (selectedD) {
        this.selectedSale.districtCode = selectedD.code;
        this.selectedSale.district = selectedD.title;
      }

      const selected = this.subDistrictList.find(
        (p) => p.code === this.selectedSale.subdistrictCode
      );
      if (selected) {
        this.selectedSale.subdistrictCode = selected.code;
        this.selectedSale.subdistrict = selected.title;
      }

      const payload = {
        ...this.selectedSale,
        attachment: undefined,
      };

      this.serviceProvider
        .post(
          `/vendorRegister/${this.selectedSale?.code != undefined ? 'update' : 'create'
          }`,
          payload
        )
        .subscribe({
          next: (res) => {
            var data: any = res;
            if (data.status == 'S') {
              this.showSuccessPopup = true;
              // this.form.reset({
              //   sellerType: 'company',
              //   consent: false,
              // });
            } else {
              // value.province = value.provinceCode;
              // value.district = value.districtCode;
              // value.subdistrict = value.subdistrictCode;
              this.popupErrorMessage = data.message;
              this.showErrorPopup = true;
            }
          },
          error: (err) => {
            // value.province = value.provinceCode;
            // value.district = value.districtCode;
            // value.subdistrict = value.subdistrictCode;
            this.popupErrorMessage = err;
            this.showErrorPopup = true;
          },
        });
    } else {
      console.log('ฟอร์มไม่ถูกต้อง');
      Object.values(form.controls).forEach((control) => {
        control.markAsTouched();
      });

      // หา element แรกที่ invalid
      const firstInvalidControl: HTMLElement | null =
        document.querySelector('input.ng-invalid');

      // ถ้ามี ให้ scroll ไปที่ตำแหน่งนั้น
      if (firstInvalidControl) {
        firstInvalidControl.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        firstInvalidControl.focus();
        return;
      }

      if (this.thaiIdValidator(this.selectedSale.taxId)) {
        // this.showTaxIdError = true;
        const taxInput = document.querySelector(
          'input[name="taxId"]'
        ) as HTMLElement;
        taxInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        taxInput?.focus();
        return;
      }
    }
  }

  update() { }

  thaiIdValidator(id: any) {
    // ไม่ต้อง validate ถ้าไม่มีค่า (ปล่อยให้ Validators.required จัดการ)
    // หรือถ้าค่าที่กรอกมายังไม่ครบ 13 หลัก
    if (!/^[0-9]+$/.test(id)) {
      return true;
    }

    if (!id || id.length !== 13 || !/^\d{13}$/.test(id)) {
      return false;
    }

    // เริ่มกระบวนการตรวจสอบ checksum
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseFloat(id.charAt(i)) * (13 - i);
    }

    const checkDigit = (11 - (sum % 11)) % 10;

    // ถ้าเลขตัวสุดท้ายไม่ตรงกับ checksum ที่คำนวณได้ ให้ return error
    if (checkDigit !== parseFloat(id.charAt(12)) || !/^[0-9]+$/.test(id)) {
      return true; // key ของ error คือ 'invalidThaiId'
    }

    // ถ้าทุกอย่างถูกต้อง ให้ return null
    return false;
  }

  closePopup(): void {
    this.showSuccessPopup = false;
    this.closeDrawer();
  }

  closeErrorPopup(): void {
    this.showErrorPopup = false;
  }

  closeDeletePopup() {
    this.isShowDeletePopup = false;
    this.deleteItem();
  }

  copyLicense(key: string) {
    navigator.clipboard.writeText(key);
  }
}
