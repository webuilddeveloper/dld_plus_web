import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleDownloadComponent } from './sale-download.component';

describe('SaleDownloadComponent', () => {
  let component: SaleDownloadComponent;
  let fixture: ComponentFixture<SaleDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleDownloadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
