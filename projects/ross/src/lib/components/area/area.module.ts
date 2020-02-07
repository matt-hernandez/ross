import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreaComponent } from './area.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    AreaComponent,
  ],
  exports: [
    AreaComponent,
  ]
})
export class AreaComponentModule { }
