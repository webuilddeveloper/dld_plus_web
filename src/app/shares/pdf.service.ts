import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor() { }

  public generatePdf(data: HTMLElement, name: string, type: string = ""): void {
    html2canvas(data, { allowTaint: true }).then(canvas => {
      const HTML_Width = 210;
      const HTML_Height = (canvas.height * HTML_Width) / canvas.width;
      const top_left_margin = 1.5;
      const PDF_Width = HTML_Width;
      const PDF_Height = 297;
      const canvas_image_width = HTML_Width;
      const canvas_image_height = HTML_Height;
      const totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');

      pdf.addImage(imgData, 'PNG', 0, 0, canvas_image_width, canvas_image_height);

      for (let i = 1; i <= totalPDFPages; i++) {
        pdf.addPage('a4', 'p');
        pdf.addImage(
          imgData,
          'PNG',
          0,
          -(PDF_Height * i) + (top_left_margin * 4),
          canvas_image_width,
          canvas_image_height
        );
      }

      if (type === "") {
        pdf.save(name + ".pdf");
      } else if (type.toLowerCase() === "open") {
        pdf.output('dataurlnewwindow');
      } else if (type.toLowerCase() === "download") {
        pdf.save(name + ".pdf");
      }
    });
  }
}
