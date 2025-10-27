import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren, ViewChild, Renderer2, OnInit, Input } from '@angular/core';
import { gsap } from 'gsap';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ServiceProviderService } from '../../shares/service-provider.service';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { ToastrService } from 'ngx-toastr';
import * as AOS from 'aos';
import { FileUploadService } from '../../shares/file-upload.service copy';


@Component({
  selector: 'app-license-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './license-register.component.html',
  styleUrls: ['./license-register.component.css'],
})
export class LicenseRegisterComponent implements OnInit {
  constructor(private fb: FormBuilder, private toastr: ToastrService, private router: Router, public serviceProviderService: ServiceProviderService,    private fileuploadService: FileUploadService,
) { }

  model: any = {
    sellerCode: '',
    companyName: '',
    licenseCount: '',
    program: '',
    package: '',
    duration: "1",
    price: 0
  };
  @Input() code = 'none';

  selectedFile: File | null = null;
  programs = ['ระบบแผนงานอัตโนมัติ (LAP)', 'ระบบจัดทำแผนพัฒนาท้องถิ่น (Smart Plan)', 'แผนพัฒนาท้องถิ่นดิจิทัลพลัส (DLD+)'];
  packages: any = {
    'ระบบแผนงานอัตโนมัติ (LAP)': [
      { name: 'Basic', keys: 1 },
      { name: 'Enterprise', keys: 5 },
      { name: 'Organize', keys: 10 }
    ],
    'ระบบจัดทำแผนพัฒนาท้องถิ่น (Smart Plan)': [
      { name: 'Basic', keys: 1 },
      { name: 'Enterprise', keys: 5 },
      { name: 'Organize', keys: 10 }

    ],
    'แผนพัฒนาท้องถิ่นดิจิทัลพลัส (DLD+)': [
      { name: 'Basic', keys: 1 },
      { name: 'Enterprise', keys: 5 },
      { name: 'Organize', keys: 10 }
    ]
  };
  availablePackages: any[] = [];



  ngOnInit() {
    AOS.init();

  }
  onProgramChange() {
    this.availablePackages = this.packages[this.model.program] || [];
    this.model.package = '';
  }

  onSelectedLicense() {
    this.model.licenseCount = this.model.package == 'Basic' ? 1 : this.model.package == 'Enterprise' ? 5 : 10;
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

  goBack() { this.router.navigate(['license-manage']); }


  onSubmit(form: any) {
    if (form.invalid) {
      this.toastr.warning('กรุณากรอกข้อมูลให้ครบถ้วน', 'Warning');
      return;
    }
    const payload = {
      sellerCode: this.model.sellerCode,
      companyName: this.model.companyName,
      licenseCount: this.model.licenseCount,
      program: this.model.program,
      package: this.model.package,
      duration: this.model.duration,
      price: this.model.price,
      fileUrl: this.model.fileUrl,
    };

    this.serviceProviderService.post("LicenseRegister/create", payload).subscribe(
      (data) => {
        let model: any = {};
        model = data;
        debugger
        if (model.status == 'E') {
          this.toastr.warning(model.message, 'Warning');
          return;
        }
        this.router.navigate(['license-generator'], {
          queryParams: model.objectData,
          skipLocationChange: true
        });

        console.log(model);
      },
      (err) => {
      }
    );
  }
}

