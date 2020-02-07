import { Component, Input, OnChanges, ChangeDetectorRef, Optional,
  ChangeDetectionStrategy } from '@angular/core';
import { applyMixins } from '../../../util/functions/mixins';
import { Stylable } from '../../../util/mixins/stylable';
import { ChartComponent } from '../../chart/chart.component';
import { BaseChartComponent } from '../../../util/interfaces/class-interfaces/base-chart-component';
import { ChartContainerComponent } from '../../chart-container/chart-container.component';
import { ContentContainer } from '../../../util/abstract-classes/content-container';
import { GroupDirective } from '../../../directives/group/group.directive';
import { DataSubscribable } from '../../../util/mixins/data-subscribable';
import { AxisElementsTheme } from '../../../util/theme/axis-elements';
import { AxisType } from '../../../util/interfaces/common-types/data';

@Component({
  selector: 'g[i-ng-axis-grid]',
  templateUrl: './axis-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AxisGridComponent
  extends applyMixins([Stylable, DataSubscribable])
  implements OnChanges, BaseChartComponent {
  /**
  * The specific style for the bar.
  */
  @Input() style: AxisElementsTheme['grid'];
  @Input() x: number;
  @Input() y: number;
  @Input() axisType: AxisType;

  rootStylePath = 'axisElements.grid';
  container: ContentContainer;

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public chart: ChartComponent,
    @Optional() chartContainer: ChartContainerComponent,
    public group: GroupDirective
  ) {
    super();
    this.container = chartContainer || chart;
  }

  onDataUpdate(): void {}

  afterDataUpdate(): void {

  }

  /**
   * The value of the `x1` attribute on the `<line>` element.
   */
  get x1(): number {
    const { x, axisType } = this;
    if (axisType === 'independent') {
      return x;
    }
    return 0;
  }

  /**
   * The value of the `x2` attribute on the `<line>` element.
   */
  get x2(): number {
    const { x } = this;
    return x;
  }

  /**
   * The value of the `y1` attribute on the `<line>` element.
   */
  get y1(): number {
    const { y, axisType } = this;
    if (axisType === 'dependent') {
      return y;
    }
    return 0;
  }

  /**
   * The value of the `y2` attribute on the `<line>` element.
   */
  get y2(): number {
    const { y } = this;
    return y;
  }
}
