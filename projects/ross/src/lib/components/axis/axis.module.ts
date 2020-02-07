import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AxisComponent } from './axis.component';
import { AxisTickComponent } from './axis-tick/axis-tick.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    AxisComponent,
    AxisTickComponent,
  ],
  exports: [
    AxisComponent,
  ]
})
export class AxisComponentModule { }
