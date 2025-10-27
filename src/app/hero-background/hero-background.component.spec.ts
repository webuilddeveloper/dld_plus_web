import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroBackgroundComponent } from './hero-background.component';

describe('HeroBackgroundComponent', () => {
  let component: HeroBackgroundComponent;
  let fixture: ComponentFixture<HeroBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroBackgroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
