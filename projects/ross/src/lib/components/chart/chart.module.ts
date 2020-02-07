import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart.component';
import { AxisComponentModule } from '../axis/axis.module';
import { ChartContainerComponentModule } from '../chart-container/chart-container.module';
import { CommonAxisPairComponentModule } from '../common-axis-pair/common-axis-pair.module';

@NgModule({
  imports: [
    CommonModule,
    AxisComponentModule,
    ChartContainerComponentModule,
    CommonAxisPairComponentModule
  ],
  declarations: [
    ChartComponent,
  ],
  exports: [
    ChartComponent,
  ]
})
export class ChartComponentModule { }
