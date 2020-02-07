import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartContainerComponent } from './chart-container.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ChartContainerComponent,
  ],
  exports: [
    ChartContainerComponent,
  ]
})
export class ChartContainerComponentModule { }
