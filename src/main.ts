import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { FormsModule } from '@angular/forms';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// ✅ เพิ่ม 2 บรรทัดนี้
import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
import { provideToastr } from 'ngx-toastr';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(FormsModule),
    provideHttpClient(),
    importProvidersFrom(BrowserAnimationsModule),
    provideToastr({
      timeOut: 2000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
      progressBar: true,
      newestOnTop: true,
      easeTime: 200,
    }),
    // ✅ สำคัญ: ให้ DI รู้จัก LottieOptions / player
    provideLottieOptions({ player: () => player }),
  ],
}).catch(err => console.error(err));
