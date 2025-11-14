import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { ServiceProviderService } from '../../shares/service-provider.service';
import * as AOS from 'aos';
import { thaiIdValidator } from '../../shares/validators';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { FileUploadService } from '../../shares/file-upload.service copy';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './vendor-register.component.html',
  styleUrls: ['./vendor-register.component.css'],
})
export class VendorRegisterComponent implements OnInit {
  submitting = signal(false);

  provinces: any[] = [];
  districts: any[] = [];
  subdistricts: any[] = [];
  showSuccessPopup = false;
  showErrorPopup = false;
  popupErrorMessage = '';
  fileName = 'กรุณาเลือกไฟล์';
  private sellerTypeSubscription: Subscription | undefined;

  // จะสร้างจริงใน ngOnInit
  form!: FormGroup;
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
    public serviceProviderService: ServiceProviderService,
    private fileuploadService: FileUploadService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    AOS.init();
    this.initForm();
    this.loadProvinces();
    this.subscribeToSellerTypeChanges();
  }

  initForm() {
    this.form = new FormGroup({
      sellerType: new FormControl<'company' | 'person'>('company', {
        nonNullable: true,
        validators: [Validators.required],
      }),

      companyName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(150)],
      }),
      taxId: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
          Validators.minLength(13),
          thaiIdValidator,
        ],
      }),
      contactName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(120)],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      phone: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.pattern(/^[0-9+\-\s]{8,20}$/),
        ],
      }),

      addressLine: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(200)],
      }),
      subdistrict: new FormControl(''),
      district: new FormControl(''),
      province: new FormControl(''),
      postalCode: new FormControl('', {
        validators: [Validators.pattern(/^\d{5}$/)],
      }),

      website: new FormControl(''),

      bankName: new FormControl(''),
      bankAccountName: new FormControl(''),
      bankAccountNumber: new FormControl(''),

      attachment: new FormControl<File | null>(null),
      consent: new FormControl(false, {
        nonNullable: true,
        validators: [Validators.requiredTrue],
      }),
      companyAffidavitFile: new FormControl('', [Validators.required]),
    });
  }

  onNumericInput(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    const sanitizedValue = input.value.replace(/[^0-9]/g, ''); // ลบทุกอย่างที่ไม่ใช่ตัวเลข

    // อัปเดตค่าในฟอร์มโดยไม่ trigger event ซ้ำซ้อน
    this.form.get(controlName)?.setValue(sanitizedValue, { emitEvent: false });
  }

  loadProvinces() {
    this.serviceProviderService.post('route/province/read', {}).subscribe({
      next: (res) => {
        var data: any = res;
        this.provinces = data.objectData;
      },
      error: (err) => console.error('load provinces failed', err),
    });
  }

  onProvinceChange(event: any) {
    const provinceCode = event.target.value;
    this.form.patchValue({ district: '', subdistrict: '', postalCode: '' });

    if (!provinceCode) {
      this.districts = [];
      this.subdistricts = [];
      return;
    }
    this.serviceProviderService
      .post('route/district/read', { province: provinceCode })
      .subscribe({
        next: (res) => {
          var data: any = res;
          this.districts = data.objectData;
        },
        error: (err) => console.error('load districts failed', err),
      });
  }

  onDistrictChange(event: any) {
    const districtCode = event.target.value;
    this.form.patchValue({ subdistrict: '', postalCode: '' });

    if (!districtCode) {
      this.subdistricts = [];
      return;
    }

    this.serviceProviderService
      .post('route/tambon/read', { district: districtCode })
      .subscribe({
        next: (res) => {
          var data: any = res;
          this.subdistricts = data.objectData;
        },
        error: (err) => console.error('load subdistricts failed', err),
      });
  }

  onSubdistrictChange(event: any) {
    const subdistrictCode = event.target.value;

    if (!subdistrictCode) {
      this.form.patchValue({ postalCode: '' });
      return;
    }
    this.serviceProviderService
      .post('route/postcode/read', { tambon: subdistrictCode })
      .subscribe({
        next: (res) => {
          var data: any = res;
          this.form.patchValue({ postalCode: data.objectData[0].postCode });
        },
        error: (err) => console.error('load postal code failed', err),
      });
  }

  onFileSelect(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileName = file.name;

      // (Optional) ตรวจสอบขนาดไฟล์
      // if (file.size > 5 * 1024 * 1024) {
      //   // 5MB
      //   this.form.get(controlName)?.setErrors({ fileSize: true });
      //   return;
      // }

      // (Optional) แสดง Loading...
      this.form.get(controlName)?.disable(); // ปิดปุ่มกันกดซ้ำ

      this.fileuploadService
        .postFile('vendorRegister', input.files[0])
        .subscribe({
          next: (data) => {
            let model: any = data;

            // ✅ ถูกต้อง: เก็บ URL ที่ได้จาก Server ลงใน Form Control
            this.form.patchValue({
              [controlName]: model.imageUrl,
            });

            // (Optional) ปิด Loading...
            this.form.get(controlName)?.enable();
            this.form.get(controlName)?.markAsTouched();
          },
          error: (err) => {
            console.log('error ', err);
            // (Optional) แสดงข้อผิดพลาดว่าอัปโหลดไม่สำเร็จ
            this.form.get(controlName)?.enable();
            this.form.get(controlName)?.setErrors({ uploadFailed: true });
          },
        });
    }
  }

  private subscribeToSellerTypeChanges(): void {
    const sellerTypeControl = this.form.get('sellerType');
    if (sellerTypeControl) {
      this.sellerTypeSubscription = sellerTypeControl.valueChanges.subscribe(value => {
        const companyNameControl = this.form.get('companyName');
        if (companyNameControl) {
          if (value === 'company') {
            // ถ้าเป็น 'company' ให้เพิ่ม Validators.required
            companyNameControl.setValidators(Validators.required);
          } else {
            // ถ้าเป็น 'person' ให้ลบ Validators ทั้งหมด (รวมถึง required)
            companyNameControl.clearValidators();
            companyNameControl.setValue(''); // (Optional) ล้างค่าในช่อง companyName ด้วย
          }
          // สำคัญมาก: ต้องเรียก updateValueAndValidity() เพื่อให้ Angular รู้ว่า validation เปลี่ยนไป
          companyNameControl.updateValueAndValidity();
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.sellerTypeSubscription?.unsubscribe();
  }

  submit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.scrollToFirstInvalidControl(); // เลื่อนไปที่ช่องแรกที่ผิด
      return; // หยุดการทำงาน
    }

    this.submitting.set(true);
    const value = this.form.value as any;

    const selectedP = this.provinces.find((p) => p.code === value.province);
    if (selectedP) {
      value.provinceCode = selectedP.code;
      value.province = selectedP.title;
    }

    const selectedD = this.districts.find((p) => p.code === value.district);
    if (selectedD) {
      value.districtCode = selectedD.code;
      value.district = selectedD.title;
    }

    const selected = this.subdistricts.find(
      (p) => p.code === value.subdistrict
    );
    if (selected) {
      value.subdistrictCode = selected.code;
      value.subdistrict = selected.title;
    }

    value.programCode = 'DLD';

    const payload = {
      ...value,
      attachment: undefined,
    };
    this.serviceProviderService
      .post('/vendorRegister/create', payload)
      .subscribe({
        next: (res) => {
          var data: any = res;
          if (data.status == 'S') {
            this.showSuccessPopup = true;
            this.form.reset({
              sellerType: 'company',
              consent: false,
            });
          } else {
            value.province = value.provinceCode;
            value.district = value.districtCode;
            value.subdistrict = value.subdistrictCode;
            this.popupErrorMessage = data.message;
            this.showErrorPopup = true;
          }
        },
        error: (err) => {
          value.province = value.provinceCode;
          value.district = value.districtCode;
          value.subdistrict = value.subdistrictCode;
          this.popupErrorMessage = err;
          this.showErrorPopup = true;
        },
      });
  }

  closePopup(): void {
    this.showSuccessPopup = false;
    this.router.navigate(['']);
  }

  closeErrorPopup(): void {
    this.showErrorPopup = false;
  }

  private scrollToFirstInvalidControl(): void {
    // 1. ให้ TypeScript อนุมาน Type เป็น HTMLElement | null โดยอัตโนมัติ
    const firstInvalidControl = document.querySelector(
      'form .ng-invalid'
    ) as HTMLElement;

    // 2. ใช้ "if" เพื่อตรวจสอบ (นี่คือ Type Guard)
    if (firstInvalidControl) {
      // ภายใน block นี้ TypeScript จะรู้ว่า firstInvalidControl เป็น HTMLElement แน่นอน
      firstInvalidControl.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }
}
