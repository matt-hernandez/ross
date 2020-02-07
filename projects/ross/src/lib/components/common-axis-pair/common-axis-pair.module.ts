import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonAxisPairComponent } from './common-axis-pair.component';
import { AxisComponentModule } from '../axis/axis.module';

@NgModule({
  imports: [
    CommonModule,
    AxisComponentModule
  ],
  declarations: [
    CommonAxisPairComponent,
  ],
  exports: [
    CommonAxisPairComponent,
  ]
})
export class CommonAxisPairComponentModule { }
