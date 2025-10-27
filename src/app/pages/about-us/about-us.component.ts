import { CommonModule } from '@angular/common';
import {
  Component,
  AfterViewInit,
  ElementRef,
  QueryList,
  ViewChildren,
  ViewChild,
  Renderer2,
  OnDestroy,
} from '@angular/core';
import { gsap } from 'gsap';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { FormsModule } from '@angular/forms';
//*** เพิ่ม LottieComponent เข้ามา ***
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import * as AOS from 'aos';

@Component({
  selector: 'app-about-us',
  standalone: true,
  //*** เพิ่ม LottieComponent ใน imports ***
  imports: [
    CommonModule,
    FormsModule,
    LottieComponent,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css'],
})
export class AboutUsComponent implements AfterViewInit, OnDestroy {
  constructor(private el: ElementRef) {}

  //*** เพิ่ม Lottie Options สำหรับพื้นหลัง ***
  heroBgLottieOptions: AnimationOptions = {
    path: 'assets/animations/circuit background 2.json',
    loop: true,
    autoplay: true,
  };

  contactTitleChars: string[] = Array.from('เกี่ยวกับเรา');

  @ViewChildren('charEl', { read: ElementRef }) charEls!: QueryList<ElementRef>;
  @ViewChild('contactBox') contactBox!: ElementRef;
  @ViewChild('contactInfo') contactInfo!: ElementRef;

  @ViewChild('linesContainer') linesContainer!: ElementRef;
  animation: any;
  @ViewChildren('featureItem') featureItems!: QueryList<ElementRef>;
  @ViewChild('rouletteText') rouletteText!: ElementRef;

  private gsapContext: any;

  features = [
    {
      title: 'พัฒนาเครื่องมือวางแผนที่มีประสิทธิภาพ',
      description:
        'เพื่อให้องค์กรปกครองส่วนท้องถิ่นสามารถจัดทำแผนพัฒนาได้อย่างรวดเร็ว เป็นระบบ และลดความผิดพลาด',
    },
    {
      title: 'รวบรวมและจัดเก็บข้อมูลในรูปแบบดิจิทัล',
      description:
        'สร้างฐานข้อมูลกลางที่มีความครบถ้วน ถูกต้อง และสามารถนำไปใช้ต่อยอดในการบริหารจัดการ',
    },
    {
      title: 'สนับสนุนการวิเคราะห์และจัดลำดับความสำคัญของโครงการ',
      description:
        'ช่วยให้สามารถกำหนดทิศทางการพัฒนาอย่างเหมาะสม และสอดคล้องกับความต้องการของพื้นที่',
    },
    {
      title: 'เชื่อมโยงแผนงานกับงบประมาณอย่างเป็นระบบ',
      description:
        'เพื่อให้การจัดทำแผนและการใช้จ่ายงบประมาณมีความสอดคล้อง และตรวจสอบได้',
    },
    {
      title: 'ส่งเสริมความโปร่งใสและการมีส่วนร่วมของประชาชน',
      description:
        'เปิดโอกาสให้ประชาชนเข้าถึงข้อมูลและร่วมแสดงความคิดเห็นในกระบวนการจัดทำแผน',
    },
    {
      title: 'ติดตามและประเมินผลได้อย่างมีประสิทธิภาพ',
      description:
        'มีระบบช่วยตรวจสอบความก้าวหน้า และผลสัมทธิ์ของโครงการในทุกขั้นตอน',
    },
  ];

  features_right = [
    {
      title: 'ส่งออกข้อมูลเป็น Word และ PDF',
      description:
        'ระบบ LAP รองรับการส่งออกข้อมูลในรูปแบบไฟล์ Word และ PDF เพื่อใช้ในงานเอกสารต่าง ๆ ได้สะดวก เช่น รายงานประจำปี รายงานความก้าวหน้า หรือแผนพัฒนาท้องถิ่นฉบับเผยแพร่',
    },
    {
      title: 'เลือกส่งออกเฉพาะส่วนที่ต้องการ',
      description:
        'ผู้ใช้งานสามารถเลือกส่งออกข้อมูลเฉพาะส่วนงานหรือหัวข้อที่ต้องการ เช่น โครงการตามยุทธศาสตร์ หรือข้อมูลผลสัมทธิ์ตามพื้นที่หมู่บ้าน/ตำบล',
    },
    {
      title: 'ใช้ร่วมกับหน่วยงานภายนอกได้',
      description:
        'ระบบรองรับการส่งออกข้อมูลเพื่อใช้ร่วมกับหน่วยงานอื่น โดยคงรูปแบบและความถูกต้องของข้อมูล ช่วยลดภาระการจัดทำรายงานซ้ำซ้อน และเพิ่มประสิทธิภาพการประสานงาน',
    },
  ];

  ngOnInit(): void {
    AOS.init();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      gsap.registerPlugin(ScrollTrigger);

      // Animate title
      gsap.from('.char', {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        duration: 0.6,
      });

      if (this.animation) this.animation.revert();

      const items = this.featureItems.map((el) => el.nativeElement);

      gsap.fromTo(
        items,
        {
          opacity: 0,
          y: 50,
          filter: 'blur(6px)',
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15, // ลด delay ให้น้อยลง
          scrollTrigger: {
            trigger: '.feature-grid', // เปลี่ยน trigger เป็น grid container
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      this.animateRouletteText('What is We-Lap?');
    }, this.el.nativeElement);
  }

  ngOnDestroy() {
    // คำสั่งนี้จะล้าง animations และ ScrollTriggers ทั้งหมดที่สร้างใน context
    if (this.gsapContext) {
      this.gsapContext.revert();
    }
  }

  animateRouletteText(text: string) {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789?!@#';
    const container = this.rouletteText.nativeElement as HTMLElement;
    container.innerHTML = '';

    const spans: HTMLElement[] = [];

    for (let i = 0; i < text.length; i++) {
      const span = document.createElement('span');
      if (text[i] === ' ') {
        span.textContent = '\u00A0';
      } else {
        span.textContent = '';
      }
      container.appendChild(span);
      spans.push(span);
    }

    let currentIndex = 0;
    const maxCount = 12; // รอบหมุนเท่ากันทุกตัว
    const intervalDuration = 30; // เวลารอบหมุน (ms)

    function animateChar(index: number) {
      if (index >= spans.length) {
        return;
      }

      if (text[index] === ' ') {
        spans[index].textContent = '\u00A0';
        currentIndex++;
        animateChar(currentIndex);
        return;
      }

      let count = 0;

      const interval = setInterval(() => {
        spans[index].textContent =
          chars[Math.floor(Math.random() * chars.length)];

        gsap.fromTo(
          spans[index],
          { scale: 1.5, opacity: 0.2 },
          { scale: 1, opacity: 1, duration: 0.15, ease: 'power1.out' }
        );

        count++;
        if (count >= maxCount) {
          clearInterval(interval);
          spans[index].textContent = text[index];
          currentIndex++;
          animateChar(currentIndex);
        }
      }, intervalDuration);
    }

    animateChar(currentIndex);
  }
}
