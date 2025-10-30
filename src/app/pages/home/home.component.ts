import { CommonModule } from '@angular/common';
import {
  Component,
  AfterViewInit,
  ElementRef,
  QueryList,
  ViewChildren,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { gsap } from 'gsap';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import gsapp from '../../gsap-loader';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HeroBackgroundComponent } from '../../hero-background/hero-background.component';
import GraphemeSplitter from 'grapheme-splitter';
import { Router } from '@angular/router';
import { ServiceProviderService } from '../../shares/service-provider.service';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';

import AOS from 'aos';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { NavbarComponent } from '../../navbar/navbar.component';
import { BentoCardComponent } from "../../conponent/bento-card/bento-card.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LottieComponent, HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
  constructor(
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private router: Router,
    public serviceProviderService: ServiceProviderService
  ) {}

  planningLottieOptions: AnimationOptions = {
    path: 'assets/animations/planning.json', // ← ไฟล์ของเพื่อน
    loop: true,
    autoplay: true,
  };

  strategyLottieOptions: AnimationOptions = {
    path: 'assets/animations/Strategy.json', // ← ชื่อไฟล์ของเพื่อน
    loop: true,
    autoplay: true,
  };

  planngLottieOptions: AnimationOptions = {
    path: 'assets/animations/Planng.json', // ← ใช้ชื่อไฟล์ตามที่มีจริง
    loop: true,
    autoplay: true,
  };



  isMobile = window.innerWidth <= 768;

  orbitWords = [
    ['Local'],
    ['Automated'],
    ['Realtime'],
    ['Data-driven'],
    ['Integrated'],
  ];

  newsList = [
    {
      id: 1,
      title:
        'สถ. เสริมสร้างองค์ความรู้ ความเข้าใจ ในกระบวนการคัดกรองและฟื้นฟูสภาพทางสังคมให้แก่ผู้เสพยาเสพติดขององค์กรปกครองส่วนท้องถิ่น',
      description:
        'วันนี้ (21 พฤษภาคม 2568) เวลา 09.00 น. ณ ห้องกรุงธน โรงแรมเดอะ รอยัล ริเวอร์ กรุงเทพฯ - นายนฤชา โฆษาศิวิไลซ์ อธิบดีกรมส่งเสริมการปกครองท้องถิ่น (สถ.) กระทรวงมหาดไทย มอบหมายให้ นายศิริพันธ์ ศรีกงพลี รองอธิบดี สถ. เปิดโครงการอบรมเสริมสร้างองค์ความรู้และความเข้าใจในกระบวนการคัดกรองและฟื้นฟูสภาพทางสังคมให้แก่ผู้เสพยาเสพติดขององค์กรปกครองส่วนท้องถิ่น ประจำปีงบประมาณ พ.ศ. 2568',
      image: 'assets/news1.jpg',
      imagesList: ['assets/news1.jpg', 'assets/news1.jpg', 'assets/news1.jpg'],
    },
    {
      id: 2,
      title: 'สถ. ร่วมงาน "BE SMART SAY NO TO DRUGS" ปีที่ 2',
      description:
        'วันนี้ (20 พฤษภาคม 2568) เวลา 14.30 น. ณ พารากอน ซีนีเพล็กซ์ ชั้น 5 สยามพารากอน - นายนฤชา โฆษาศิวิไลซ์ อธิบดีกรมส่งเสริมการปกครองท้องถิ่น (สถ.) กระทรวงมหาดไทย มอบหมายให้ นายสุรพล เจริญภูมิ รองอธิบดี สถ. ร่วมเป็นเกียรติในพิธีเปิดโครงการสื่อสาร สร้างสรรค์ รู้เท่าทันยาบ้า "BE SMART SAY NO TO DRUGS" ภายใต้แนวคิด "Hug Your Dream; Light Up Your Life" (กอดฝัน จุดพลังชีวิต) ที่เปิดพื้นที่ให้เยาวชนทั่วประเทศได้แสดงความคิดสร้างสรรค์ผ่านสื่อดิจิทัล',
      image: 'assets/news2.jpg',
      imagesList: ['assets/news2.jpg', 'assets/news2.jpg', 'assets/news2.jpg'],
    },
    {
      id: 3,
      title: 'ทถจ.น่าน ร่วมพิธีเปิดศาลาปฏิบัติธรรมพระธรรมจาริก เฉลิมพระเกียรติ',
      description:
        'วันอาทิตย์ ที่ 25 พฤษภาคม 2568 เวลา 09.30 น. นายสมชาย เกตะมะ ท้องถิ่นจังหวัดน่าน ร่วมพิธีเปิดศาลาปฏิบัติธรรมพระธรรมจาริก เฉลิมพระเกียรติพระบาทสมเด็จพระเจ้าอยู่หัว โดยโครงการทุนเล่าเรียนหลวงสำหรับพระสงฆ์ โดยมี พลเอก สุรยุทธ์ จุลานนท์ ประธานองคมนตรี เป็นประธานในพิธีเปิดฯ ณ ที่พักสงฆ์พระธรรมจาริกปางแก หมู่ที่ 7 บ้านปางแก ตำบลทุ่งช้าง อำเภอทุ่งช้าง จังหวัดน่าน',
      image: 'assets/news3.jpg',
      imagesList: ['assets/news3.jpg', 'assets/news3.jpg', 'assets/news3.jpg'],
    },
  ];

  extendedVideoList = [
    {
      youtubeId: '3saFCddi-Eo',
      thumbnail: 'assets/thumb1.jpg',
      title: 'สรุปผลการดำเนินงานจัดกิจกรรมร้านกาชาด 67',
    },
    {
      youtubeId: 'exdgDCmQWyA',
      thumbnail: 'assets/thumb2.jpg',
      title:
        'คลิปวิดีโอ อธิบายแนวทางการปฏิบัติงานตามหนังสือ ที่ มท 0808.4/ว 3008 ลว. 12 ก.ค. 67',
    },

    {
      youtubeId: 'SO-I1Jpzl8Q',
      thumbnail: 'assets/thumb2.jpg',
      title:
        'การประชุมรับฟังความคิดเห็นการใช้งานระบบสารสนเทศในการให้บริการประชาชน (Local Service) สำหรับ อบจ. (คลินิก Local Service)',
    },

    {
      youtubeId: 'IbTqUa6TnUE',
      thumbnail: 'assets/thumb2.jpg',
      title:
        'ประชุมเตรียมความพร้อมรองรับการเปิดใช้งานระบบสารสนเทศในการให้บริการประชาชน เมื่อวันที่ 13 ก.พ. 2566',
    },
  ];

  hoveredIndex: number | null = null;

  extendedNewsList = [...this.newsList, ...this.newsList]; // วนลูปโดยการ clone
  modelNews: any = [];

  tween!: gsap.core.Tween;

  @ViewChildren('layer') layers!: QueryList<ElementRef>;
  @ViewChild('sentence') sentence!: ElementRef<HTMLDivElement>;
  @ViewChild('underline', { static: true })
  underline!: ElementRef<HTMLDivElement>;
  @ViewChild('underlineRef', { static: true })
  underlineRef!: ElementRef<HTMLDivElement>;

  @ViewChild('slider', { static: true }) sliderRef!: ElementRef;
  @ViewChildren('videoCard') videoCards!: QueryList<ElementRef>;
  @ViewChildren('videoElement') videos!: QueryList<ElementRef>;
  @ViewChild('heroBg') heroBgRef!: ElementRef;
  @ViewChild('readMoreBtn') readMoreBtn!: ElementRef;

  @ViewChild('triggerSection') triggerSection!: ElementRef;
  @ViewChild('spreadSection') spreadSection!: ElementRef;
  @ViewChild('welcomeText') welcomeText!: ElementRef;
  @ViewChild('subText') subText!: ElementRef<HTMLDivElement>;

  newsCards = [
    { image: 'assets/news1.jpg' },
    { image: 'assets/news2.jpg' },
    { image: 'assets/news3.jpg' },
    { image: 'assets/news4.jpg' },
  ];

  businessTeamLottieOptions: AnimationOptions = {
    path: 'assets/animations/Business team.json', // <-- ใช้ Animation อื่นเพื่อความหลากหลาย
    loop: true,
    autoplay: true,
  };

  brainstormingLottieOptions: AnimationOptions = {
    path: 'assets/animations/Brainstorming.json', // <-- ใช้ Animation อื่นเพื่อความหลากหลาย
    loop: true,
    autoplay: true,
  };

   officeAccountantLottieOptions: AnimationOptions = {
    path: 'assets/animations/Office Accountant.json', // <-- ใช้ Animation อื่นเพื่อความหลากหลาย
    loop: true,
    autoplay: true,
  };

  videoPlayers = new Map<string, HTMLVideoElement>();

  ngAfterViewInit() {
    AOS.init({
      duration: 700, // ความเร็วอนิเมชัน
      offset: 120, // เริ่มเล่นก่อนถึง viewport นิดหน่อย
      easing: 'ease-out-quart',
      once: true, // เล่นครั้งเดียว (เอาออกถ้าอยากให้เล่นซ้ำตอนสกรอลล์ขึ้นลง)
    });

    this.readProduct();
    this.readNews();
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const highlightEls =
      this.sentence.nativeElement.querySelectorAll('.highlight');

    highlightEls.forEach((el) => {
      // mouse enter animation
      el.addEventListener('mouseenter', () => {
        gsap.to(el, {
          scale: 1.3,
          color: '#0070f3',
          textShadow: '0 0 8px rgba(0,112,243,0.7)',
          duration: 0.3,
          ease: 'power1.out',
        });
      });

      // mouse leave animation
      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          scale: 1,
          color: '#000',
          textShadow: 'none',
          duration: 0.3,
          ease: 'power1.out',
        });
      });
    });

    const durations = [11, 8, 16, 9.5]; // หมุนเร็ว-ช้าแตกต่างกัน

    this.layers.forEach((layerRef, i) => {
      const layer = layerRef.nativeElement;
      const wrappers = layer.querySelectorAll('.word-wrapper');
      const radius = 180 + i * 10;

      wrappers.forEach((wrapper: HTMLElement, j: number) => {
        const angle = (360 / wrappers.length) * j;
        wrapper.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
      });

      gsap.to(layer, {
        rotationY: '+=360',
        duration: durations[i % durations.length],
        repeat: -1,
        ease: 'none',
        transformOrigin: 'center center',
      });
    });

    const items = this.sliderRef.nativeElement.children;
    const totalWidth = Array.from(items).reduce(
      (acc: number, el: any) => acc + el.offsetWidth + 20,
      0
    ); // 20 = margin

    this.tween = gsap.to(this.sliderRef.nativeElement, {
      x: `-=${totalWidth / 2}`, // แค่ครึ่งเดียวเพราะ clone 2 เท่า
      duration: 20,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => {
          const value = parseFloat(x);
          return (value % (totalWidth / 2)).toString();
        }),
      },
    });

    const newsItems = gsap.utils.toArray('.news-item');

    gsap.fromTo(
      newsItems,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.news-container',
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play reverse play reverse',
          // scrub: true,
        },
      }
    );

    // parallax ภาพ
    newsItems.forEach((item: any) => {
      const image = item.querySelector('.image');
      if (image) {
        gsap.to(image, {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    });

    gsap.to(this.underline.nativeElement, {
      scrollTrigger: {
        trigger: this.underline.nativeElement,
        start: 'top 80%',
        toggleActions: 'play reverse play reverse',
      },
      duration: 1,
      scaleX: 1,
      ease: 'power2.out',
      opacity: 0.3,
    });

    gsap.to(this.underlineRef.nativeElement, {
      scrollTrigger: {
        trigger: this.underlineRef.nativeElement,
        start: 'top 80%',
        toggleActions: 'play reverse play reverse',
      },
      duration: 1,
      scaleX: 1,
      ease: 'power2.out',
      opacity: 0.3,
    });

    // Stack layout
    gsap.set('.news-card', {
      y: (i: any) => i * -20,
      scale: (i: any) => 1 - i * 0.05,
      filter: 'blur(2px)',
    });

    // Fade-in text
    gsap.utils.toArray('.fade-in-text').forEach((el: any) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        onEnter: () => this.renderer.addClass(el, 'visible'),
        onLeaveBack: () => this.renderer.removeClass(el, 'visible'),
      });
    });

    this.animateWelcomeText().then(() => {
      this.animateSubText();
    });

    /* ================================
     *  ✨ Timeline: ไหลเข้าตามสกรอลล์
     * ================================ */
    const tlItems = gsap.utils.toArray<HTMLElement>(
      '#digital-planning-timeline .timeline-item'
    );

    tlItems.forEach((item) => {
      const dot = item.querySelector('.timeline-dot') as HTMLElement | null;

      // เซ็ตค่าเริ่ม (กันกะพริบ)
      gsap.set(item, { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: 'top 85%', // เริ่มเมื่อหัวรายการเข้าโซนมองเห็น
          end: 'top 60%', // จบเมื่อเลื่อนขึ้นอีกนิด
          scrub: 0.5, // ผูกกับการเลื่อน (ไหลตามสกรอลล์)
          // ถ้าอยากให้โชว์ครั้งเดียว: ใช้ onLeaveBack ปิดทริกเกอร์ (ยกเลิก scrub)
          // onLeaveBack: self => { gsap.set(item, {opacity: 1, y: 0}); self.disable(); },
        },
      });

      // กล่องเนื้อหา: เฟดอิน + เลื่อนขึ้น
      tl.to(
        item,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        },
        0
      );

      // วงกลมไอคอน: เด้งนิด ๆ
      if (dot) {
        tl.fromTo(
          dot,
          { scale: 0.75, filter: 'blur(4px)' },
          {
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.45,
            ease: 'back.out(1.7)',
          },
          0.05
        );
      }
    });

    // // Parallax / Spread อื่น ๆ ที่คอมเมนต์ไว้ของเพื่อน
    // gsap.to('.parallax-card', { ... });
    // gsap.utils.toArray('.spread-card').forEach(...);
  }

  pauseSlide() {
    this.tween?.pause();
  }

  resumeSlide() {
    this.tween?.resume();
  }

  openNews(param: object) {
    let data = {
      model: JSON.stringify(param),
    };
    this.router.navigate(['news-detail'], { queryParams: data });
  }

  scrollToNews() {
    gsap.to(window, {
      duration: 1.2,
      scrollTo: {
        y: '#news-section',
        offsetY: 60,
      },
      ease: 'power4.inOut',
    });
  }

  onHover(index: number) {
    if (!this.isMobile) {
      this.hoveredIndex = index;
    }
  }

  onLeave() {
    if (!this.isMobile) {
      this.hoveredIndex = null;
    }
  }

  onClick(index: number) {
    if (this.isMobile) {
      this.hoveredIndex = index;
    }
  }

  getYoutubeEmbedUrl(youtubeId: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`
    );
  }

  getYoutubeThumbnail(youtubeId: string): string {
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  }

  fallbackThumbnail(event: Event, youtubeId: string) {
    const img = event.target as HTMLImageElement;
    img.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  }

  animateWelcomeText(): Promise<void> {
    return new Promise((resolve) => {
      const textEl = this.welcomeText.nativeElement;
      const rawText: string = (textEl.textContent ?? '').trim();

      textEl.textContent = ''; // เคลียร์ข้อความเก่า
      gsap.set(textEl, { opacity: 1 });

      for (let i = 0; i < rawText.length; i++) {
        const span = document.createElement('span');
        span.textContent = rawText[i];
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        span.style.filter = 'blur(4px)';
        span.style.transform = 'scale(1.5)';
        textEl.appendChild(span);

        gsap.to(span, {
          opacity: 1,
          filter: 'blur(0px)',
          scale: 1,
          duration: 0.15,
          delay: i * 0.15,
          ease: 'power2.out',
          onComplete: i === rawText.length - 1 ? () => resolve() : undefined,
        });
      }
    });
  }

  animateSubText(): Promise<void> {
    return new Promise((resolve) => {
      const message =
        'เครื่องมือวางแผนพัฒนาท้องถิ่นแบบดิจิทัลรวบรวม จัดเก็บ และวิเคราะห์\nข้อมูลอย่างเป็นระบบ เพื่อช่วยให้องค์กรปกครองส่วนท้องถิ่นวางแผน\nได้รวดเร็ว แม่นยำ เชื่อมโยงงบประมาณกับแผนงาน โปร่งใส ตรวจสอบได้\nและเปิดโอกาสให้ประชาชนมีส่วนร่วม';

      const container = this.subText.nativeElement;
      container.textContent = ''; // เคลียร์ข้อความเก่า

      const splitter = new GraphemeSplitter();
      const chars = splitter.splitGraphemes(message); // 👈 รองรับอักขระไทยรวม

      chars.forEach((char, i) => {
        if (char === '\n') {
          container.appendChild(document.createElement('br'));
        } else {
          const span = document.createElement('span');
          span.textContent = char;
          span.style.opacity = '0';
          span.style.display = 'inline-block';
          span.style.filter = 'blur(4px)';
          span.style.transform = 'scale(1.5)';
          container.appendChild(span);

          gsap.to(span, {
            opacity: 1,
            filter: 'blur(0px)',
            scale: 1,
            duration: 0.03,
            delay: i * 0.03,
            ease: 'power2.out',
            onComplete: i === chars.length - 1 ? () => resolve() : undefined,
          });
        }
      });
    });
  }

  readProduct() {
    this.serviceProviderService.post('m/product/read', {}).subscribe({
      next: (data) => {
        console.log('response data:', data);
      },
      error: (err) => {
        console.error('error from API:', err);
      },
    });
  }

  readNews() {
    this.serviceProviderService.post('news/read', {}).subscribe(
      (response) => {
        var data: any = response;
        this.modelNews = data.objectData;
      },
      (err) => {
        // this.toastr.error(err.error.message, 'แจ้งเตือนระบบ', {
        //   titleClass: 'toast-msg',
        //   messageClass: 'toast-msg',
        //   positionClass: 'toast-bottom-right',
        //   timeOut: 5000,
        // });
      }
    );
  }

  @ViewChild(NavbarComponent) navbar!: NavbarComponent;
  content: any = null;

  contact = { name: '', email: '', message: '' };

  ngOnInit() {
    fetch('/assets/data/site-content.json')
      .then(res => res.json())
      .then(data => this.content = data);
  }

  onSectionChange(sectionId: any) {
    if (this.navbar) this.navbar.activeSection = sectionId;
  }

  sendMessage() {
    alert(`ขอบคุณครับ คุณ ${this.contact.name}\nข้อความของคุณถูกส่งเรียบร้อย!`);
    this.contact = { name: '', email: '', message: '' };
  }

  scrollTo(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

