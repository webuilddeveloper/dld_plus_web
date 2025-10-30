import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { LicenseRegisterComponent } from './pages/license-register/license-register.component';
import { DocumentReceiptComponent } from './pages/document-receipt/document-receipt.component';
import { NewsDetailComponent } from './pages/news-detail/news-detail.component';
import { LoginMemberComponent } from './pages/login-member/login-member.component';
import { UserComponent } from './pages/user/user.component';
import { SaleHistoryComponent } from './pages/sale-history/sale-history.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LicenseGeneratorComponent } from './pages/license-generator/license-generator.component';
import { SaleManageComponent } from './pages/sale-manage/sale-manage.component';
import { UserAdminComponent } from './pages/user-admin/user-admin.component';
import { LicenseManageComponent } from './pages/license-manage/license-manage.component';
import { LicenseRegisterUserComponent } from './pages/license-register-user/license-register-user.component';
import { LicensePrintComponent } from './pages/license-print/license-print.component';
import { SalePurchaseOrderComponent } from './pages/sale-purchase-order/sale-purchase-order.component';
import { LicenseRegisterUserPoComponent } from './pages/license-register-user-po/license-register-user-po.component';
import { PrintPoComponent } from './pages/print-po/print-po.component';
import { PrintQuotationComponent } from './pages/print-quotation/print-quotation.component';
import { authGuard } from './guards/auth.guard';
import { SaleDownloadComponent } from './pages/sale-download/sale-download.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'document-receipt', component: DocumentReceiptComponent },
  { path: 'news-detail', component: NewsDetailComponent },
  {
    path: 'vendor-register',
    loadComponent: () =>
      import('./pages/vendor-register/vendor-register.component').then(
        (m) => m.VendorRegisterComponent
      ),
  },
  {
    path: 'login-member',
    loadComponent: () =>
      import('./pages/login-member/login-member.component').then(
        (m) => m.LoginMemberComponent
      ),
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    data: { roles: ['user', 'admin'] }, // ✅ ผู้ใช้ทั่วไปและแอดมินเข้าได้
  },
  {
    path: 'print-po',
    component: PrintPoComponent,
    canActivate: [authGuard],
    data: { roles: ['user', 'admin'] },
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [authGuard],
    data: { roles: ['user'] }, // ✅ ผู้ใช้ทั่วไป
  },
  {
    path: 'sale-purchase-order',
    component: SalePurchaseOrderComponent,
    canActivate: [authGuard],
    data: { roles: ['user'] },
  },
  {
    path: 'license-register-user',
    component: LicenseRegisterUserComponent,
    canActivate: [authGuard],
    data: { roles: ['user'] },
  },
  {
    path: 'license-register-user-po',
    component: LicenseRegisterUserPoComponent,
    canActivate: [authGuard],
    data: { roles: ['user'] },
  },
  {
    path: 'sale-history',
    component: SaleHistoryComponent,
    canActivate: [authGuard],
    data: { roles: ['user'] },
  },
  {
    path: 'license-print',
    component: LicensePrintComponent,
    canActivate: [authGuard],
    data: { roles: ['user'] },
  },
  {
    path: 'sale-download',
    component: SaleDownloadComponent,
    canActivate: [authGuard],
    data: { roles: ['user'] },
  },
  {
    path: 'print-quotation',
    component: PrintQuotationComponent,
    canActivate: [authGuard],
    data: { roles: ['user', 'admin'] },
  },
  {
    path: 'user-admin',
    component: UserAdminComponent,
    canActivate: [authGuard],
    data: { roles: ['admin'] }, // ✅ แค่ admin เข้าได้
  },
  {
    path: 'license-manage',
    component: LicenseManageComponent,
    canActivate: [authGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'sale-manage',
    component: SaleManageComponent,
    canActivate: [authGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'license-register',
    component: LicenseRegisterComponent,
    canActivate: [authGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'license-generator',
    component: LicenseGeneratorComponent,
    canActivate: [authGuard],
    data: { roles: ['admin'] },
  },

  { path: '**', redirectTo: '' },
];
