import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarComponent } from './bar.component';
import { SingleBarComponent } from './single-bar/single-bar.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    BarComponent,
    SingleBarComponent,
  ],
  exports: [
    BarComponent,
  ]
})
export class BarComponentModule { }
