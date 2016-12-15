import { Component } from '@angular/core';

import { Alarm } from '../models/alarm';


@Component({
  selector: 'alarm-detail',
  template: `
    <div *ngIf="alarm">
      <h2>{{alarm.ancestry}} details!</h2>
      <div><label>id: </label>{{alarm.hostType}}</div>
      <div>
        <label>name: </label>
        <input [(ngModel)]="alarm.hostName" placeholder="name"/>
      </div>
    </div>
  `
})

export class AlarmDetailComponent {
    alarm: Alarm;
}