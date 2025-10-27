import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { ServiceProviderService } from '../../shares/service-provider.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
  imports: [CommonModule, SidebarComponent],
})
export class NewsComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    public serviceProviderService: ServiceProviderService,
  ) { }

  model: any = {};
  modelNews: any = [];

  selectedImage: string | null = null;

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.modelNews = JSON.parse(params['model']);
    });

    this.readNews();
  }

  openImage(image: string) {
    this.selectedImage = image;
  }

  closeImage() {
    this.selectedImage = null;
  }

  readNews() {
    this.serviceProviderService
      .post('news/read', { 'code': this.modelNews.code })
      .subscribe(
        (response) => {
          var data: any = response;
          this.model = data.objectData[0];

          this.serviceProviderService
            .post('m/news/gallery/read', { 'code': this.modelNews.code })
            .subscribe(
              (response) => {
                var data: any = response;
                this.model.imagesList = data.objectData;
                

              }, (err) => { });

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
}
