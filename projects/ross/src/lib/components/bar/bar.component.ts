import { Component, Input, Optional, ChangeDetectionStrategy, ChangeDetectorRef, Self } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { ChartContainerComponent } from '../chart-container/chart-container.component';
import { GroupDirective } from '../../directives/group/group.directive';
import { ChartChildManagerService } from '../../services/chart-child-manager.service';
import { ContentContainer } from '../../util/abstract-classes/content-container';
import { BarTheme } from '../../util/theme/bar';
import { VisualizerType } from '../../util/interfaces/common-types/drawing';
import { applyMixins } from '../../util/functions/mixins';
import { Stylable } from '../../util/mixins/stylable';
import { BaseChartComponent } from '../../util/interfaces/class-interfaces/base-chart-component';
import { DataVisualizable } from '../../util/mixins/data-visualizable';
import { AnimateSettings } from '../../util/interfaces/common-types/animating';
import { DataSubscribable } from '../../util/mixins/data-subscribable';
import { dataIsValid } from '../../util/functions/data';
import { DOMDependentDirective } from '../../directives/dom-dependent/dom-dependent.directive';
import { DOMDependendable } from '../../util/mixins/dom-dependendable';

let id = 0;

@Component({
  selector: 'g[i-ng-bar]',
  templateUrl: './bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarComponent extends
  applyMixins([DataVisualizable, Stylable, DataSubscribable, DOMDependendable])
  implements BaseChartComponent {
  /**
   * Any styles to override.
   */
  @Input() style: BarTheme;
  /**
   * Animate settings to pass to the individual bars.
   */
  @Input() animate: AnimateSettings;
  readonly id = id++;
  /**
   * The name of this visualization. This property will become useful in tooltips. If no name
   * is provided, it defaults to the constructor name with an ID number concatenated to the end.
   */
  @Input() name = `${this.constructor.name}${this.id}`;

  rootStylePath = 'bar';
  visualizerType: VisualizerType = 'Bar';
  container: ContentContainer;

  constructor(
    public chart: ChartComponent,
    public chartChildManagerService: ChartChildManagerService,
    @Optional() chartContainer: ChartContainerComponent,
    public group: GroupDirective,
    public changeDetectorRef: ChangeDetectorRef,
    @Self() public domDependent: DOMDependentDirective,
  ) {
    super();
    this.container = chartContainer || chart;
  }

  onDataUpdate(): void {}

  afterDataUpdate(): void {}

  /**
   * The spread of bars based on the `spread` input in the group.
   */
  get spread(): number {
    const { group: { spread = 0 } } = this;
    return spread;
  }

  /**
   * The index of this bar chart in reference to other bar charts anywhere, not just in the group.
   */
  get visualizerTypeIndex(): number {
    const { chart } = this;
    const barCharts = chart.getChildComponentsOfType(this);
    const validBarCharts = barCharts.filter(bar => dataIsValid(bar.data));
    const index = validBarCharts.indexOf(this);
    return index;
  }

  /**
   * The number bar charts anywhere, not just in the group.
   */
  get visualizerTypeLength(): number {
    const { chart } = this;
    const barCharts = chart.getChildComponentsOfType(this);
    const validBarCharts = barCharts.filter(bar => dataIsValid(bar.data));
    return validBarCharts.length;
  }

  /**
   * The style object to pass to the individual bars, whether its the default styling or an
   * object passed into the `style` input.
   */
  get resolveStyle(): any {
    const { style } = this;
    if (style && style.data) {
      return style.data;
    }
    return this.getStyleProp('bar.data');
  }

  trackByFn(index, datum): number {
    return datum.x;
  }
}
