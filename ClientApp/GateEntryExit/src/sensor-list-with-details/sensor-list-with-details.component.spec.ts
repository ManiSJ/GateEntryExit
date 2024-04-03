import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorListWithDetailsComponent } from './sensor-list-with-details.component';

describe('SensorListWithDetailsComponent', () => {
  let component: SensorListWithDetailsComponent;
  let fixture: ComponentFixture<SensorListWithDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SensorListWithDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SensorListWithDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
