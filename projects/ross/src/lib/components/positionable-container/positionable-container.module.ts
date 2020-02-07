import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PositionableContainerComponent } from './positionable-container.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PositionableContainerComponent,
  ],
  exports: [
    PositionableContainerComponent,
  ]
})
export class PositionableContainerComponentModule { }
