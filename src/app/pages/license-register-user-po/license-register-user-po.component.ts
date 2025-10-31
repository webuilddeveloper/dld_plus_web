import { CommonModule } from '@angular/common';
import {
  Component,
  AfterViewInit,
  ElementRef,
  QueryList,
  ViewChildren,
  ViewChild,
  Renderer2,
  OnInit,
  Input,
} from '@angular/core';
import { gsap } from 'gsap';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import ScrollTrigger from 'gsap/ScrollTrigger';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ServiceProviderService } from '../../shares/service-provider.service';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { ToastrService } from 'ngx-toastr';
import * as AOS from 'aos';
import { FileUploadService } from '../../shares/file-upload.service copy';

@Component({
  selector: 'app-license-register-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './license-register-user-po.component.html',
  styleUrls: ['./license-register-user-po.component.css'],
})
export class LicenseRegisterUserPoComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    public serviceProviderService: ServiceProviderService,
    private fileuploadService: FileUploadService,
    private activatedRoute: ActivatedRoute,
  ) { }

  model: any = {
    sellerCode: '',
    companyName: '',
    licenseCount: '',
    program: 'แผนพัฒนาท้องถิ่นดิจิทัลพลัส (DLD+)',
    package: '',
  };
  @Input() code = 'none';
  licenseRegisterCode : any = "";
  selectedFile: File | null = null;
  programs = [
    // { name: 'ระบบแผนงานอัตโนมัติ (LAP)', code: 'LAP' },
    // { name: 'ระบบจัดทำแผนพัฒนาท้องถิ่น (Smart Plan)', code: 'SMP' },
    { name: 'แผนพัฒนาท้องถิ่นดิจิทัลพลัส (DLD+)', code: 'DLD' },
  ];
  packages: any =
    [
      { name: 'Basic', keys: 1 },
      { name: 'Enterprise', keys: 5 },
      { name: 'Organize', keys: 10 },
    ];

  availablePackages: any[] = [];

  showSuccessPopup = false;
  popupSuccessTitle = 'บันทึกข้อมูลเรียบร้อย';

  ngOnInit() {
    AOS.init();
    this.model.code = localStorage.getItem('code') ?? '';
    this.activatedRoute.queryParams.subscribe((params) => {
      this.licenseRegisterCode = params['code'];
      this.readLicenseRegister();
    });
  }
  onProgramChange() {
    this.availablePackages = this.packages[this.model.program] || [];
    this.model.package = '';
  }

  onSelectedLicense() {
    this.model.licenseCount =
      this.model.package == 'Basic'
        ? 1
        : this.model.package == 'Enterprise'
          ? 5
          : 10;
  }

  readLicenseRegister() {
    this.serviceProviderService
      .post('licenseRegister/read', {
        code: this.licenseRegisterCode,
      })
      .subscribe(
        (data) => {
          let model: any = {};
          model = data;
          if (model.status == 'S') {
            this.model = model.objectData[0];

          }
        },
        (err) => { }
      );
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileuploadService.postFile(this.code, input.files[0]).subscribe(
        (data) => {
          let model: any = {};
          model = data;
          this.model.fileUrl = model.imageUrl;
        },
        (err) => {
          console.log('error ', err);
        }
      );
    }
  }

  goBack() {
    this.router.navigate(['sale-purchase-order']);
  }

  onSubmit(form: any) {
    if (form.invalid) {
      this.toastr.warning('กรุณากรอกข้อมูลให้ครบถ้วน', 'Warning');
      return;
    }
    const payload = {
      code: this.licenseRegisterCode,
      description: this.model.description,
    };

    this.serviceProviderService
      .post('licenseRegister/updatePo', payload)
      .subscribe(
        (data) => {
          let model: any = {};
          model = data;
          if (model.status == 'E') {
            this.toastr.warning(model.message, 'Warning');
            return;
          }
          this.showSuccessPopup = true;
        },
        (err) => { }
      );
  }

  closePopup(): void {
    this.showSuccessPopup = false;
        this.router.navigate(['sale-purchase-order']);

  }
}
