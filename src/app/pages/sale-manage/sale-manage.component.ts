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
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { Router } from '@angular/router';
import { FileUploadService } from '../../shares/file-upload.service copy';

@Component({
  selector: 'app-sale-manage',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './sale-manage.component.html',
  styleUrl: './sale-manage.component.scss',
})
export class SaleManageComponent {
  submitting = signal(false);
  seller = { name: 'อดิศร แสงสว่าง', code: 'EMP-045' };
  isClosing = false;

  salesList: any[] = [];
  selectAll = false;
  btnDelete = false;

  selectedSale: any = {
    sellerType: 'company',
    provinceCode: '',
    districtCode: '',
    subdistrictCode: '',
  };
  isDrawer = false;
  searchTerm = '';
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
  uploadingState: any = {};

  banks = [
    { code: 'BBL', name: 'ธนาคารกรุงเทพ' },
    { code: 'KBANK', name: 'ธนาคารกสิกรไทย' },
    { code: 'KTB', name: 'ธนาคารกรุงไทย' },
    { code: 'SCB', name: 'ธนาคารไทยพาณิชย์' },
    { code: 'TTB', name: 'ธนาคารทหารไทยธนชาต' },
    { code: 'BAY', name: 'ธนาคารกรุงศรีอยุธยา' },
    { code: 'GSB', name: 'ธนาคารออมสิน' },
    { code: 'UOB', name: 'ธนาคารยูโอบี' },
    { code: 'BAAC', name: 'ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร (ธ.ก.ส.)' },
    { code: 'CIMBT', name: 'ธนาคารซีไอเอ็มบีไทย' },
    { code: 'GHB', name: 'ธนาคารอาคารสงเคราะห์ (ธอส.)' },
    { code: 'ISBT', name: 'ธนาคารอิสลามแห่งประเทศไทย' },
    { code: 'KKP', name: 'ธนาคารเกียรตินาคินภัทร' },
    { code: 'LHFG', name: 'ธนาคารแลนด์ แอนด์ เฮ้าส์' },
    { code: 'TISCO', name: 'ธนาคารทิสโก้' },
    { code: 'ICBCT', name: 'ธนาคารไอซีบีซี (ไทย)' },
  ];

  constructor(
    private serviceProvider: ServiceProviderService,
    private router: Router,
    private fileuploadService: FileUploadService
  ) {}

  ngOnInit() {
    // this.selectedSale = {};
    this.readSale();
    this.readProvince();
  }

  readSale() {
    this.serviceProvider
      .post('vendorRegister/read', {
        keySearch: this.criteriaModel.keySearch,
        startDate: this.criteriaModel.startDate,
        endDate: this.criteriaModel.endDate,
        status: this.criteriaModel.status,
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

  readProvince() {
    this.serviceProvider.post('route/province/read', {}).subscribe(
      (data) => {
        let model: any = {};
        model = data;
        if (model.status == 'S') {
          this.provinceList = model.objectData;
        }
      },
      (err) => {}
    );
  }

  readDistrict(code: string) {
    this.serviceProvider
      .post('route/district/read', { province: code })
      .subscribe(
        (data) => {
          let model: any = {};
          model = data;
          if (model.status == 'S') {
            this.districtList = model.objectData;
          }
        },
        (err) => {}
      );
  }

  readSubDistrict(code: string) {
    this.serviceProvider
      .post('route/tambon/read', { district: code })
      .subscribe(
        (data) => {
          let model: any = {};
          model = data;
          if (model.status == 'S') {
            this.subDistrictList = model.objectData;
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

  selectProvince(event: Event) {
    this.districtList = [];
    this.subDistrictList = [];
    this.selectedSale.districtCode = '';
    this.selectedSale.subdistrictCode = '';
    this.selectedSale.postalCode = '';
    const value = event.target as HTMLInputElement;
    this.readDistrict(value.value);
  }

  selectDistrict(event: Event) {
    this.subDistrictList = [];
    this.selectedSale.subdistrictCode = '';
    this.selectedSale.postalCode = '';
    const value = event.target as HTMLInputElement;
    this.readSubDistrict(value.value);
  }

  selectSubDistrict(event: Event) {
    const value = event.target as HTMLInputElement;
    let model = this.subDistrictList.find((x: any) => x.code == value.value);
    this.selectedSale.postalCode = model.postCode;
  }

  openDrawer(sale: any) {
    this.selectedSale = { ...sale };
    // this.filteredLicenses = [...sale.licenses];
    // debugger

    if ((sale.provinceCode ?? '') != '') this.readDistrict(sale.provinceCode);
    if ((sale.districtCode ?? '') != '')
      this.readSubDistrict(sale.districtCode);
    // this.updatePagination();
    // document.body.classList.add('drawer-open');
    this.isDrawer = true;
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
        s.companyName.toLowerCase().includes(term) ||
        s.contactName.toLowerCase().includes(term)
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

  onFileSelect(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // (Optional) ตรวจสอบขนาดไฟล์
      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        this.popupErrorMessage = 'ไฟล์มีขนาดใหญ่เกิน 5MB';
        this.showErrorPopup = true;
        return;
      }

      this.uploadingState[controlName] = true; // เริ่ม Loading

      this.fileuploadService
        .postFile('vendorRegister', file) // อัปโหลดไปที่ server
        .subscribe({
          next: (data) => {
            let model: any = data;

            // ✅ อัปเดต URL ลงใน object 'selectedSale' โดยตรง
            this.selectedSale[controlName] = model.imageUrl;

            this.uploadingState[controlName] = false; // เสร็จสิ้น Loading
            input.value = ''; // เคลียร์ค่าใน input file
          },
          error: (err) => {
            console.log('error ', err);
            this.popupErrorMessage = 'อัปโหลดไฟล์ไม่สำเร็จ';
            this.showErrorPopup = true;
            this.uploadingState[controlName] = false; // ปิด Loading
          },
        });
    }
  }

  getFileName(url: string | null | undefined): string {
    if (!url) {
      return '';
    }
    try {
      // พยายามดึงส่วนสุดท้ายหลังเครื่องหมาย /
      const decodedUrl = decodeURIComponent(url);
      const segments = decodedUrl.split('/');
      // อาจจะต้องลบ query string ออกก่อน (ถ้ามี)
      const fileNameWithQuery = segments.pop() || '';
      return fileNameWithQuery.split('?')[0];
    } catch (e) {
      console.error('Error parsing file URL:', e);
      return url; // คืนค่า URL เดิมถ้ามีปัญหา
    }
  }
}
