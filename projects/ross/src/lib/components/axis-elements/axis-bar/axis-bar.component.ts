import { Component, Input, OnChanges, ChangeDetectorRef, Optional,
  ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { applyMixins } from '../../../util/functions/mixins';
import { Stylable } from '../../../util/mixins/stylable';
import { ChartComponent } from '../../chart/chart.component';
import { BaseChartComponent } from '../../../util/interfaces/class-interfaces/base-chart-component';
import { ChartContainerComponent } from '../../chart-container/chart-container.component';
import { ContentContainer } from '../../../util/abstract-classes/content-container';
import { GroupDirective } from '../../../directives/group/group.directive';
import { DataSubscribable } from '../../../util/mixins/data-subscribable';
import { IndependentAxisType, AxisType } from '../../../util/interfaces/common-types/data';
import { Alignment } from '../../../util/interfaces/common-types/positioning';
import { AxisElementsTheme } from '../../../util/theme/axis-elements';

@Component({
  selector: 'g[i-ng-axis-bar]',
  templateUrl: './axis-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AxisBarComponent
  extends applyMixins([Stylable, DataSubscribable])
  implements OnChanges, BaseChartComponent {
  /**
  * The specific style for the bar.
  */
  @Input() style: AxisElementsTheme['bars'];
  @Input() alignment: Alignment;
  @Input() startValue: number;
  @Input() tickValue: IndependentAxisType;
  @Input() endValue: number;
  @Input() index: number;
  @Input() axisType: AxisType;
  @ViewChild('animatingNode') animatingNode: ElementRef;

  rootStylePath = 'axisElements.bars';
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
   * The value of the `fill` attribute on the `<rect>` element.
   */
  get fill(): string {
    const { tickValue, index } = this;
    if (index % 2 === 1) {
      return this.getStyleProp('axisElements.bars.oddNumberedFill', index, tickValue);
    }
    return this.getStyleProp('axisElements.bars.evenNumberedFill', index, tickValue);
  }

  /**
   * The value of the `x` attribute on the `<rect>` element.
   */
  get x(): number {
    const { startValue, axisType } = this;
    if (axisType === 'dependent') {
      return 0;
    }
    return startValue;
  }

  /**
   * The value of the `y` attribute on the `<rect>` element.
   */
  get y(): number {
    const { endValue, axisType } = this;
    if (axisType === 'independent') {
      return 0;
    }
    return endValue;
  }

  /**
   * The value of the `width` attribute on the `<rect>` element.
   */
  get width(): number {
    const { endValue, startValue, axisType, container: { width } } = this;
    if (axisType === 'dependent') {
      return width;
    }
    return endValue - startValue;
  }

  /**
   * The value of the `height` attribute on the `<rect>` element.
   */
  get height(): number {
    const { endValue, startValue, axisType, container: { height } } = this;
    if (axisType === 'independent') {
      return height;
    }
    return startValue - endValue;
  }
}
