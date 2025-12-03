import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FooterComponent } from "../../footer/footer.component";
import { HeaderComponent } from "../../header/header.component";

@Component({
  selector: 'app-gov-announcement',
  standalone: true,
  imports: [CommonModule, FooterComponent, HeaderComponent],
  templateUrl: './gov-announcement.component.html',
  styleUrls: ['./gov-announcement.component.css'],
})
export class GovAnnouncementComponent {
  documents: string[] = [
    'https://we-lap.co.th/docs/S_22487076_1.jpg',
    'https://we-lap.co.th/docs/S_22487078_2.jpg',
    'https://we-lap.co.th/docs/S_22487079_3.jpg',
    'https://we-lap.co.th/docs/S_22487080_4.jpg',
  ];

  selectedImage: string | null = null;

 openPreview(src: string) {
  this.selectedImage = src;
}

closePreview() {
  this.selectedImage = null;
}


  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.selectedImage) {
      this.closePreview();
    }
  }
}
