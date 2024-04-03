import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GateEntryComponent } from './gate-entry.component';

describe('GateEntryComponent', () => {
  let component: GateEntryComponent;
  let fixture: ComponentFixture<GateEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GateEntryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GateEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
