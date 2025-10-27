import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ServiceProviderService } from './shares/service-provider.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'we-lap-web';

  constructor(
    private serviceProviderService: ServiceProviderService,
    private router: Router
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // 5. สั่งให้เลื่อนไปบนสุด
        window.scrollTo(0, 0);
      });
  }

  ngOnInit(): void {
    const key = 'hasVisited';
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, 'true');
      this.serviceProviderService
        .post('log/firstVisit', {
          title: 'first_visit',
          description: '',
        })
        .subscribe({
          next: () => console.log('First visit logged'),
          error: (err) => console.error('Log failed', err),
        });
    }
  }
}
