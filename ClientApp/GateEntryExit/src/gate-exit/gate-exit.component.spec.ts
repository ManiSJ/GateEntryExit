import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GateExitComponent } from './gate-exit.component';

describe('GateExitComponent', () => {
  let component: GateExitComponent;
  let fixture: ComponentFixture<GateExitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GateExitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GateExitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
