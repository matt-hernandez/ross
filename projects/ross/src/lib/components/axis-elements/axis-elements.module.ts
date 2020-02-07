import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AxisElementsComponent } from './axis-elements.component';
import { AxisBarComponent } from './axis-bar/axis-bar.component';
import { AxisGridComponent } from './axis-grid/axis-grid.component';
import { AxisCrossSectionComponent } from './axis-cross-section/axis-cross-section.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    AxisElementsComponent,
    AxisBarComponent,
    AxisGridComponent,
    AxisCrossSectionComponent,
  ],
  exports: [
    AxisElementsComponent,
  ]
})
export class AxisElementsComponentModule { }
