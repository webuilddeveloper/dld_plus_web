import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import AOS from 'aos';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LottieComponent, HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {

  content: any = null;

  // ─── Lottie Options ───────────────────────────────────────────────────────

  waveBackgroundLottieOptions: AnimationOptions = {
    path: 'assets/animations/WAVE BACKGROUND.json',
    loop: true,
    autoplay: true,
  };

  businessTeamLottieOptions: AnimationOptions = {
    path: 'assets/animations/Business team.json',
    loop: true,
    autoplay: true,
  };

  officeAccountantLottieOptions: AnimationOptions = {
    path: 'assets/animations/Office Accountant.json',
    loop: true,
    autoplay: true,
  };

  strategyLottieOptions: AnimationOptions = {
    path: 'assets/animations/Strategy.json',
    loop: true,
    autoplay: true,
  };

  planngLottieOptions: AnimationOptions = {
    path: 'assets/animations/Planng.json',
    loop: true,
    autoplay: true,
  };

  brainstormingLottieOptions: AnimationOptions = {
    path: 'assets/animations/Brainstorming.json',
    loop: true,
    autoplay: true,
  };

  planningLottieOptions: AnimationOptions = {
    path: 'assets/animations/planning.json',
    loop: true,
    autoplay: true,
  };

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  ngOnInit() {
    fetch('/assets/data/site-content.json')
      .then(res => res.json())
      .then(data => this.content = data);
  }

  ngAfterViewInit() {
    AOS.init({
      duration: 700,
      offset: 120,
      easing: 'ease-out-quart',
      once: true,
    });
  }

  // ─── Methods ──────────────────────────────────────────────────────────────

  scrollTo(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  gotoPDF() {
    window.open('https://khubdeedlt.we-builds.com/wb-document/images/welap/CATALOGDLD+.pdf', '_blank');
  }
}
