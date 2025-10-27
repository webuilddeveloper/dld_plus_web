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


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'license-register', component: LicenseRegisterComponent },
  { path: 'document-receipt', component: DocumentReceiptComponent },
  { path: 'news-detail', component: NewsDetailComponent },
  {
    path: 'vendor-register',
    loadComponent: () =>
      import('./pages/vendor-register/vendor-register.component')
        .then(m => m.VendorRegisterComponent)
  },
  {
    path: 'login-member',
    loadComponent: () =>
      import('./pages/login-member/login-member.component').then(m => m.LoginMemberComponent),
  },
  { path: 'user', component: UserComponent },
  { path: 'sale-history', component: SaleHistoryComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'license-generator', component: LicenseGeneratorComponent },
  { path: 'sale-manage', component: SaleManageComponent },
  { path: 'user-admin', component: UserAdminComponent },
  { path: 'license-manage', component: LicenseManageComponent },
  { path: 'print-po', component: PrintPoComponent },
  { path: 'license-print', component: LicensePrintComponent },
  { path: 'license-register-user', component: LicenseRegisterUserComponent },
  { path: 'sale-purchase-order', component: SalePurchaseOrderComponent },
  { path: 'license-register-user-po', component: LicenseRegisterUserPoComponent },
  { path: 'print-quotation', component: PrintQuotationComponent },

  { path: '**', redirectTo: '' }
];
