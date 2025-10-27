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

@Component({
  selector: 'app-license-manage',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './license-manage.component.html',
  styleUrl: './license-manage.component.scss',
})
export class LicenseManageComponent {
  submitting = signal(false);
  seller = { name: 'อดิศร แสงสว่าง', code: 'EMP-045' };
  isClosing = false;

  salesList: any[] = [];
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
  itemsPerPage = 5;
  totalPages = 1;
  limit = 5;

  currentSalePage = 1;
  saleItemsPerPage = 5;
  totalSalePages = 1;
  selectedIndex: number = 0;
  form!: FormGroup;
  showSuccessPopup = false;
  popupSuccessTitle = 'บันทึกข้อมูลเรียบร้อย';
  showErrorPopup = false;
  popupErrorMessage = '';
  isShowDeletePopup = false;

  constructor(
    private serviceProvider: ServiceProviderService,
    private router: Router
  ) {}

  ngOnInit() {
    // this.selectedSale = {};
    this.readSale();
  }

  printPO(sale: any) {
    let data = {
      model: JSON.stringify(sale),
    };
    this.router.navigate(['print-po'], {
      queryParams: data,
      skipLocationChange: true,
    });
    return;
  }

  goToLicenseRegister() {
    this.router.navigate(['license-register']);
    return;
  }

  readSale() {
    this.serviceProvider
      .post('licenseRegister/read', {
        keySearch: this.searchSales,
        limit: this.limit,
      })
      .subscribe(
        (data) => {
          let model: any = {};
          model = data;
          if (model.status == 'S') {
            this.salesList = model.objectData;
            this.filteredSales = [...this.salesList];
            this.updateSalePagination();
          }
        },
        (err) => {}
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
        (err) => {}
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
      (err) => {}
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
    this.readSale();
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

  filterSales() {
    const term = this.criteriaModel.keySearch.toLowerCase();
    this.filteredSales = this.salesList.filter(
      (s) =>
        s.orderId.toLowerCase().includes(term) ||
        s.sellerCode.toLowerCase().includes(term)
    );
    this.currentSalePage = 1;
    this.updateSalePagination();
  }

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
    this.router.navigate(['user-admin']);
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
      debugger;

      this.serviceProvider
        .post(
          `/vendorRegister/${
            this.selectedSale?.code != undefined ? 'update' : 'create'
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
      debugger;
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

  update() {}

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
