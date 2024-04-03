import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GateEntryExitComponent } from './gate-entry-exit.component';

describe('GateEntryExitComponent', () => {
  let component: GateEntryExitComponent;
  let fixture: ComponentFixture<GateEntryExitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GateEntryExitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GateEntryExitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
