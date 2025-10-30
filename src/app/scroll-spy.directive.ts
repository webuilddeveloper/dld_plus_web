import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appScrollSpy]',
  standalone: true
})
export class ScrollSpyDirective {
  @Output() sectionChange = new EventEmitter<string>();
  private sections: HTMLElement[] = [];

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.sections = Array.from(this.el.nativeElement.querySelectorAll('section[id]'));
  }

  @HostListener('window:scroll', [])
  onScroll() {
    const scrollPosition = window.scrollY + 200;
    for (const section of this.sections) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        this.sectionChange.emit(section.id);
        break;
      }
    }
  }
}
