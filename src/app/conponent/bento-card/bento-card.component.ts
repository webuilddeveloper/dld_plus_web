import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type BentoSize = 'span-3'|'span-4'|'span-6'|'span-2'|'span-12';

@Component({
  selector: 'app-bento-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bento-card.component.html',
  styleUrl: './bento-card.component.scss'
})
export class BentoCardComponent {
  @Input() size = 'span-3';
  @Input() row2 = false;
  @Input() aos = 'fade-up';
  @Input() aosDelay = 0;

  get classes() {
    return {
      [this.size]: true,
      'row-2': this.row2
    };
  }
}
