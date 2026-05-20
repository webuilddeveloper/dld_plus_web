import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { GovAnnouncementComponent } from './pages/gov-announcement/gov-announcement.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'gov-announcement', component: GovAnnouncementComponent },
  {
    path: 'vendor-register',
    loadComponent: () =>
      import('./pages/vendor-register/vendor-register.component').then(
        (m) => m.VendorRegisterComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
