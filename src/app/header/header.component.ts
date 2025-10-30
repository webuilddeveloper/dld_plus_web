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
  ) {
    // โหลดข้อมูลจาก localStorage
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');

    if (storedUser) {
      this.userName = storedUser;
      this.userRole = storedRole;
      this.isLoggedIn = true;
    }

    // ปิด dropdown เมื่อ route เปลี่ยน
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        this.isDropdownOpen = false;
        this.isMenuOpen = false;
      });

    // ปิด dropdown เมื่อคลิกข้างนอก
    document.addEventListener('click', () => (this.isDropdownOpen = false));
  }


  isMenuOpen = false;
  isDropdownOpen = false;
  isSubMenuOpen = false;

  // ✅ ข้อมูลผู้ใช้
  isLoggedIn = false;
  userName: string | null = null;
  userRole: string | null = null;

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

  // ✅ ไปหน้าตาม role
  goToProfile() {
    if (!this.userRole) return;

    if (this.userRole === 'admin') {
      this.router.navigate(['/user-admin']);
    } else {
      this.router.navigate(['/user']);
    }

    this.isDropdownOpen = false;
  }

  // ✅ ออกจากระบบ
  logout() {
    localStorage.clear();
    this.userName = null;
    this.userRole = null;
    this.isLoggedIn = false;
    this.router.navigate(['/login-member']);
    this.isDropdownOpen = false;
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
