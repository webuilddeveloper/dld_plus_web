import { Injectable } from '@angular/core';
import * as AOS from 'aos';

@Injectable({ providedIn: 'root' })
export class AosService {
  private initialized = false;

  init() {
    if (!this.initialized) {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: false,
        mirror: true,
      });
      this.initialized = true;
    } else {
      setTimeout(() => {
        AOS.refreshHard();
      }, 200);
    }
  }

  safeRefresh() {
    document.querySelectorAll('[data-aos]').forEach(el => {
      (el as HTMLElement).style.opacity = '1';
      (el as HTMLElement).style.transform = 'none';
    });
    setTimeout(() => AOS.refreshHard(), 400);
  }
}
