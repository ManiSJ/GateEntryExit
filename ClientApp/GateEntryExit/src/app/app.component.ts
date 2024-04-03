import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GateComponent } from '../gate/gate.component';
import { GateEntryComponent } from '../gate-entry/gate-entry.component';
import { GateExitComponent } from '../gate-exit/gate-exit.component';
import { SensorComponent } from '../sensor/sensor.component';
import { SensorListWithDetailsComponent } from '../sensor-list-with-details/sensor-list-with-details.component';
import { GateEntryExitComponent } from '../gate-entry-exit/gate-entry-exit.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, 
    GateComponent, 
    GateEntryExitComponent,
    SensorComponent,
    SensorListWithDetailsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'GateEntryExit';
}
