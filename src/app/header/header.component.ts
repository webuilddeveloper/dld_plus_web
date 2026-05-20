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
  isMenuOpen = false;
  isSubMenuOpen = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => (this.isMenuOpen = false));
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.isSubMenuOpen = false;
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
      scrollToPricing();
    } else {
      this.router.navigate(['/']).then(() => {
        this.router.events
          .pipe(
            filter((e): e is NavigationEnd => e instanceof NavigationEnd),
            first()
          )
          .subscribe(() => setTimeout(() => scrollToPricing(), 300));
      });
    }
  }
}
