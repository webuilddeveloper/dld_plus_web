import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren, ViewChild, Renderer2 } from '@angular/core';
import { gsap } from 'gsap';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements AfterViewInit {
  constructor(private el: ElementRef) { }

  contactTitleChars: string[] = Array.from('ติดต่อเรา');

  @ViewChildren('charEl', { read: ElementRef }) charEls!: QueryList<ElementRef>;
  @ViewChild('contactBox') contactBox!: ElementRef;
  @ViewChild('contactInfo') contactInfo!: ElementRef;

  @ViewChild('linesContainer') linesContainer!: ElementRef; animation: any;

  ngAfterViewInit() {

    gsap.registerPlugin(ScrollTrigger);

    // Animate title
    gsap.from('.char', {
      y: 50,
      opacity: 0,
      stagger: 0.1,
      ease: 'back.out(1.7)',
      duration: 0.6,
    });

    const lines: HTMLElement[] = gsap.utils.toArray(
      this.linesContainer.nativeElement.querySelectorAll('.contact-line')
    );

    if (this.animation) this.animation.revert();

    this.animation = gsap.from(lines, {
      scrollTrigger: {
        trigger: this.linesContainer.nativeElement,
        start: 'top 50%',
        toggleActions: 'play none none reverse',
        markers: false, // เปลี่ยนเป็น true ถ้ายัง debug อยู่
      },
      y: 90,                      // ให้ลอยขึ้นสูงกว่าปกติ
      rotationX: -120,            // หมุนมิติแรงขึ้น
      opacity: 0,
      transformOrigin: '50% 100% -200px',
      ease: 'back.out(1.2)',      // เด้งแบบนุ่มนวล
      duration: 0.9,
      stagger: 0.2,
    });

    // Animation ให้กล่องขยับนิด ๆ ตาม scroll
    gsap.to(this.contactBox.nativeElement, {
      y: -80,              // ขยับกล่องขึ้นมากขึ้น (เดิม -40)
      ease: 'sine.out',
      scrollTrigger: {
        trigger: this.contactBox.nativeElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.8,        // delay, smooth ตาม scroll มากขึ้น (เดิม 0.8)
      },
    });

        // Animation ให้กล่องขยับนิด ๆ ตาม scroll
    gsap.to(this.contactInfo.nativeElement, {
      y: -80,              // ขยับกล่องขึ้นมากขึ้น (เดิม -40)
      ease: 'sine.out',
      scrollTrigger: {
        trigger: this.contactInfo.nativeElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.8,        // delay, smooth ตาม scroll มากขึ้น (เดิม 0.8)
      },
    });

    gsap.from(this.el.nativeElement.querySelectorAll('.form-row, .send-button'), {
      y: 30,
      stagger: 0.2,
      duration: 0.8,
      ease: 'power2.out'
    });

  }

  onSubmit() {
    alert('Form submitted!');
  }

}