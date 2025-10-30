import { Directive, ElementRef, AfterViewInit, OnDestroy, Input } from '@angular/core';

@Directive({
  selector: '[gridAutoRowSpan]',
  standalone: true
})
export class GridAutoRowSpanDirective implements AfterViewInit, OnDestroy {
  @Input('gridAutoRowSpan') rowHeightPx?: number; // optional override
  @Input() gridGapPx?: number;

  private el: HTMLElement;
  private ro?: ResizeObserver;
  private imgs: HTMLImageElement[] = [];

  constructor(private host: ElementRef<HTMLElement>) {
    this.el = host.nativeElement;
  }

  ngAfterViewInit(): void {
    // observe size change for the item itself
    this.ro = new ResizeObserver(() => this.updateSpan());
    this.ro.observe(this.el);

    // observe images inside (they may load later)
    this.imgs = Array.from(this.el.querySelectorAll('img'));
    this.imgs.forEach(i => {
      this.ro?.observe(i);
      // ensure if already loaded we still update
      if (i.complete) this.updateSpan();
      else i.addEventListener('load', () => this.updateSpan());
    });

    // also run a first calculation after small delay for fonts/images
    setTimeout(() => this.updateSpan(), 80);
  }

  ngOnDestroy(): void {
    this.ro?.disconnect();
    this.imgs.forEach(i => i.removeEventListener('load', () => this.updateSpan()));
  }

  private findGridContainer(el: HTMLElement): HTMLElement | null {
    let p: HTMLElement | null = el.parentElement;
    while (p) {
      const display = getComputedStyle(p).display;
      if (display && display.includes('grid')) return p;
      p = p.parentElement;
    }
    return null;
  }

  private updateSpan() {
    const grid = this.findGridContainer(this.el);
    if (!grid) return;

    const style = getComputedStyle(grid);
    const rowHeight = this.rowHeightPx ?? (parseInt(style.getPropertyValue('grid-auto-rows')) || 14);
    const rowGap = this.gridGapPx ?? (parseInt(style.getPropertyValue('row-gap')) || parseInt(style.getPropertyValue('gap')) || 18);

    const contentHeight = this.el.getBoundingClientRect().height;
    // formula
    const span = Math.ceil((contentHeight + rowGap) / (rowHeight + rowGap));
    this.el.style.gridRowEnd = `span ${span}`;
  }
}
