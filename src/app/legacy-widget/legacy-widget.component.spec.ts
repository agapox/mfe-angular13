import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegacyWidgetComponent } from './legacy-widget.component';

describe('LegacyWidgetComponent', () => {
  let component: LegacyWidgetComponent;
  let fixture: ComponentFixture<LegacyWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LegacyWidgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegacyWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
