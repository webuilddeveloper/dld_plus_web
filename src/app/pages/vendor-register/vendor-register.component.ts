import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { ServiceProviderService } from '../../shares/service-provider.service';
import AOS from 'aos';
import { thaiIdValidator } from '../../shares/validators';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { FileUploadService } from '../../shares/file-upload.service copy';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, FooterComponent, FormsModule],
  templateUrl: './vendor-register.component.html',
  styleUrls: ['./vendor-register.component.css'],
})
export class VendorRegisterComponent implements OnInit, OnDestroy {
  provinces: any[] = [];
  districts: any[] = [];
  subdistricts: any[] = [];
  showSuccessPopup = false;
  showErrorPopup = false;
  popupErrorMessage = '';
  fileName = 'กรุณาเลือกไฟล์';
  isSameAddress = false;

  private sellerTypeSubscription: Subscription | undefined;

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

  ngOnDestroy(): void {
    this.sellerTypeSubscription?.unsubscribe();
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
        validators: [Validators.required, Validators.pattern(/^[0-9+\-\s]{8,20}$/)],
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
      shippingAddress: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(200)],
      }),
    });
  }

  onNumericInput(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    const sanitized = input.value.replace(/[^0-9]/g, '');
    this.form.get(controlName)?.setValue(sanitized, { emitEvent: false });
  }

  loadProvinces() {
    this.serviceProviderService.post('route/province/read', {}).subscribe({
      next: (res) => {
        const data: any = res;
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
    this.serviceProviderService.post('route/district/read', { province: provinceCode }).subscribe({
      next: (res) => {
        const data: any = res;
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
    this.serviceProviderService.post('route/tambon/read', { district: districtCode }).subscribe({
      next: (res) => {
        const data: any = res;
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
    this.serviceProviderService.post('route/postcode/read', { tambon: subdistrictCode }).subscribe({
      next: (res) => {
        const data: any = res;
        this.form.patchValue({ postalCode: data.objectData[0].postCode });
      },
      error: (err) => console.error('load postal code failed', err),
    });
  }

  onFileSelect(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.fileName = file.name;
    this.form.get(controlName)?.disable();

    this.fileuploadService.postFile('vendorRegister', file).subscribe({
      next: (data) => {
        const model: any = data;
        this.form.patchValue({ [controlName]: model.imageUrl });
        this.form.get(controlName)?.enable();
        this.form.get(controlName)?.markAsTouched();
      },
      error: () => {
        this.form.get(controlName)?.enable();
        this.form.get(controlName)?.setErrors({ uploadFailed: true });
      },
    });
  }

  private subscribeToSellerTypeChanges(): void {
    const sellerTypeControl = this.form.get('sellerType');
    if (!sellerTypeControl) return;

    this.sellerTypeSubscription = sellerTypeControl.valueChanges.subscribe(value => {
      const companyNameControl = this.form.get('companyName');
      if (!companyNameControl) return;

      if (value === 'company') {
        companyNameControl.setValidators(Validators.required);
      } else {
        companyNameControl.clearValidators();
        companyNameControl.setValue('');
      }
      companyNameControl.updateValueAndValidity();
    });
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.scrollToFirstInvalidControl();
      return;
    }

    const value = this.form.value as any;

    const selectedP = this.provinces.find(p => p.code === value.province);
    if (selectedP) {
      value.provinceCode = selectedP.code;
      value.province = selectedP.title;
    }

    const selectedD = this.districts.find(p => p.code === value.district);
    if (selectedD) {
      value.districtCode = selectedD.code;
      value.district = selectedD.title;
    }

    const selected = this.subdistricts.find(p => p.code === value.subdistrict);
    if (selected) {
      value.subdistrictCode = selected.code;
      value.subdistrict = selected.title;
    }

    value.programCode = 'DLD';
    const payload = { ...value, attachment: undefined };

    this.serviceProviderService.post('/vendorRegister/create', payload).subscribe({
      next: (res) => {
        const data: any = res;
        if (data.status === 'S') {
          this.showSuccessPopup = true;
          this.form.reset({ sellerType: 'company', consent: false });
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
    const firstInvalid = document.querySelector('form .ng-invalid') as HTMLElement;
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  onCopyAddress(event: any) {
    if (event.target.checked) {
      const address = this.form.get('addressLine')?.value;
      this.form.get('shippingAddress')?.setValue(address);
    } else {
      this.form.get('shippingAddress')?.setValue('');
    }
  }
}
