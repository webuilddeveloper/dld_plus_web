import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  constructor(private el: ElementRef, private router: Router) { }


  isWhiteBg = true;
  isBottom = false;

  menuOpen = false;


  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollY = window.scrollY || window.pageYOffset;

    // segment สีพื้นหลัง
    const segmentHeight = 100;
    const segmentIndex = Math.floor(scrollY / segmentHeight);
    this.isWhiteBg = (segmentIndex % 2 === 0);

    // เปลี่ยนคลาส .at-bottom ให้ sidebar
    const sidebar = this.el.nativeElement.querySelector('.sidebar') as HTMLElement;
    if (sidebar) {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      const threshold = 1000;

      if (scrollPosition >= pageHeight - threshold) {
        sidebar.classList.add('at-bottom');
      } else {
        sidebar.classList.remove('at-bottom');
      }

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      this.isBottom = scrollTop + windowHeight >= docHeight - 700; // เผื่อ offset 10px

    }

    // ✅ เพิ่มการใส่/ลบคลาส .scrolled ให้กับ .top-right-menu-web
    const topRightMenu = this.el.nativeElement.querySelector('.top-right-menu-web') as HTMLElement;
    if (topRightMenu) {
      if (scrollY > 50) {
        topRightMenu.classList.add('scrolled');
      } else {
        topRightMenu.classList.remove('scrolled');
      }
    }
  }


  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  goPricing(event: Event) {
    event.preventDefault();

    const doScroll = () => {
      const el = document.getElementById('pricing');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    // ถ้าอยู่หน้า Home แล้ว เลื่อนเลย
    if (this.router.url === '/' || this.router.url.startsWith('/#')) {
      doScroll();
    } else {
      // ถ้าอยู่หน้าอื่น ให้กลับไปหน้า Home แล้วค่อยเลื่อน
      this.router.navigate(['/']).then(() => {
        setTimeout(doScroll, 100); // หน่วงให้ DOM พร้อมก่อนเลื่อน
      });
    }

    // ปิด overlay ถ้าเปิดอยู่
    if (this.menuOpen) {
      this.menuOpen = false;
    }
  }
}
