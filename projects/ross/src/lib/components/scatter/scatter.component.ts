import { Component, Input, Optional, ChangeDetectionStrategy, ChangeDetectorRef, } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { ChartContainerComponent } from '../chart-container/chart-container.component';
import { GroupDirective } from '../../directives/group/group.directive';
import { ChartChildManagerService } from '../../services/chart-child-manager.service';
import { ContentContainer } from '../../util/abstract-classes/content-container';
import { ScatterTheme } from '../../util/theme/scatter';
import { VisualizerType } from '../../util/interfaces/common-types/drawing';
import { Symbol } from '../../util/interfaces/common-types/symbol';
import { applyMixins } from '../../util/functions/mixins';
import { Stylable } from '../../util/mixins/stylable';
import { BaseChartComponent } from '../../util/interfaces/class-interfaces/base-chart-component';
import { DataVisualizable } from '../../util/mixins/data-visualizable';
import { AnimateSettings } from '../../util/interfaces/common-types/animating';
import { DataSubscribable } from '../../util/mixins/data-subscribable';

let id = 0;

@Component({
  selector: 'g[i-ng-scatter]',
  templateUrl: './scatter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScatterComponent extends
  applyMixins([DataVisualizable, Stylable, DataSubscribable])
  implements BaseChartComponent {
  /**
   * Any styles to override.
   */
  @Input() style: ScatterTheme;
  /**
   * Animate settings to pass to the individual scatters.
   */
  @Input() animate: AnimateSettings;
  readonly id = id++;
  /**
   * The name of this visualization. This property will become useful in tooltips. If no name
   * is provided, it defaults to the constructor name with an ID number concatenated to the end.
   */
  @Input() name = `${this.constructor.name}${this.id}`;
  /**
   * The shape of data points.
   */
  @Input() pointShape: Symbol = Symbol['circle'];

  rootStylePath = 'scatter';
  visualizerType: VisualizerType = 'Scatter';
  container: ContentContainer;

  constructor(
    public chart: ChartComponent,
    public chartChildManagerService: ChartChildManagerService,
    @Optional() chartContainer: ChartContainerComponent,
    public group: GroupDirective,
    public changeDetectorRef: ChangeDetectorRef,
  ) {
    super();
    this.container = chartContainer || chart;
  }

  onDataUpdate(): void {}

  afterDataUpdate(): void {}

  /**
   * The style object to pass to the individual scatters, whether its the default styling or an
   * object passed into the `style` input.
   */
  get resolveStyle(): any {
    const { style } = this;
    if (style && style.data) {
      return style.data;
    }
    return this.getStyleProp('scatter.data');
  }

  trackByFn(index, datum): number {
    return datum.x;
  }
}
