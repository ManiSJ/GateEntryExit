import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GateModalComponent } from './gate-modal.component';

describe('GateModalComponent', () => {
  let component: GateModalComponent;
  let fixture: ComponentFixture<GateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GateModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
