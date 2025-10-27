import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, first } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule, RouterModule],
})
export class HeaderComponent {
  isSticky = false;
  constructor(
    private router: Router,
  ) { }


  isMenuOpen = false;
  isDropdownOpen = false;
  isSubMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.isDropdownOpen = false;
    this.isSubMenuOpen = false;
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleSubMenu() {
    this.isSubMenuOpen = !this.isSubMenuOpen;
  }

  @HostListener('window:scroll', [])
  onScroll() {
    this.isSticky = window.scrollY > 50;
  }

  goPricing(event: Event) {
    event.preventDefault();

    const scrollToPricing = () => {
      const el = document.querySelector('#pricing');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        // ถ้ายังไม่เจอ element ให้ลองอีกครั้งทุก 100ms (สูงสุด 10 ครั้ง)
        let tries = 0;
        const interval = setInterval(() => {
          const target = document.querySelector('#pricing');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            clearInterval(interval);
          } else if (++tries > 10) {
            clearInterval(interval);
          }
        }, 100);
      }
    };

    if (this.router.url === '/') {
      // ถ้าอยู่หน้า Home แล้ว → scroll ได้เลย
      scrollToPricing();
    } else {
      // ถ้าอยู่หน้าอื่น → รอกลับไปหน้า Home ก่อน
      this.router.navigate(['/']).then(() => {
        this.router.events
          .pipe(
            filter((e): e is NavigationEnd => e instanceof NavigationEnd),
            first()
          )
          .subscribe(() => {
            // รอ DOM render เสร็จ
            setTimeout(() => scrollToPricing(), 300);
          });
      });
    }
  }
}
