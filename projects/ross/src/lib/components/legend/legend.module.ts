import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegendComponent } from './legend.component';
import { LegendSwatchComponent } from './legend-swatch.component';
import { LegendSwatchSectionComponent } from './legend-swatch-section.component';
import { LegendSwatchGridComponent } from './legend-swatch-grid.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    LegendComponent,
    LegendSwatchComponent,
    LegendSwatchSectionComponent,
    LegendSwatchGridComponent
  ],
  exports: [
    LegendComponent,
    LegendSwatchComponent,
    LegendSwatchSectionComponent,
    LegendSwatchGridComponent
  ]
})
export class LegendComponentModule { }
