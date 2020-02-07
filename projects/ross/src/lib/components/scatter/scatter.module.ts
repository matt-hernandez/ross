import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScatterComponent } from './scatter.component';
import { ScatterPointComponent } from './scatter-point/scatter-point.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ScatterComponent,
    ScatterPointComponent,
  ],
  exports: [
    ScatterComponent,
  ]
})
export class ScatterComponentModule { }
