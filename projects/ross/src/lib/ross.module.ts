import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* Components Block Start */
import { AxisComponentModule } from './components/axis/axis.module';
import { BarComponentModule } from './components/bar/bar.module';
import { ChartComponentModule } from './components/chart/chart.module';
import { ChartContainerComponentModule } from './components/chart-container/chart-container.module';
import { CommonAxisPairComponentModule } from './components/common-axis-pair/common-axis-pair.module';
import { LegendComponentModule } from './components/legend/legend.module';
import { LineComponentModule } from './components/line/line.module';
import { PositionableContainerComponentModule } from './components/positionable-container/positionable-container.module';
import { ScatterComponentModule } from './components/scatter/scatter.module';
import { TitleComponentModule } from './components/title/title.module';
import { AxisElementsComponentModule } from './components/axis-elements/axis-elements.module';
import { AreaComponentModule } from './components/area/area.module';
/* Components Block End */

import { DirectivesModule } from './directives/directives.module';

/* Services Block Start */
import { LegendSwatchService } from './services/legend-swatch.service';
/* Services Block End */

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    DirectivesModule
  ],
  exports: [
    /* Components Exports Block Start */
    AxisComponentModule,
    BarComponentModule,
    ChartComponentModule,
    ChartContainerComponentModule,
    CommonAxisPairComponentModule,
    DirectivesModule,
    LegendComponentModule,
    LineComponentModule,
    PositionableContainerComponentModule,
    ScatterComponentModule,
    TitleComponentModule,
    AxisElementsComponentModule,
    AreaComponentModule,
    /* Components Exports Block End */
  ],
  providers: [
    /* Services Exports Block Start */
    LegendSwatchService,
    /* Services Exports Block End */
  ]
})
export class RossModule { }
