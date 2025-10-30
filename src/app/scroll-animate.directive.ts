import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appScrollAnimate]',
  standalone: true
})
export class ScrollAnimateDirective implements OnInit {
  @Input('appScrollAnimate') animationClass = 'fade-up';
  private hasAnimated = false;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const el = this.el.nativeElement;

    const applyAnimation = () => {
      if (!this.hasAnimated) {
        el.classList.add('animated', this.animationClass);
        this.hasAnimated = true;
      }
    };

    // ✅ ป้องกันไม่ให้ element ที่ยังไม่อยู่ในจอ unobserve ทันที
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            applyAnimation();
            observer.unobserve(el); // ทำงานแค่ครั้งแรกที่เห็น
          }
        });
      },
      {
        threshold: 0.05,           // 👉 ตรวจจับไวขึ้น
        rootMargin: '0px 0px -20% 0px' // 👉 เริ่มแสดงก่อนถึง viewport เล็กน้อย
      }
    );

    observer.observe(el);

    // ✅ เผื่อกรณี hero อยู่ใน viewport ตั้งแต่เริ่ม
    requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        applyAnimation();
        observer.unobserve(el);
      }
    });
  }
}
