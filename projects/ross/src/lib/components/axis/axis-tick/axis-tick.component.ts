import { Component, Input, OnChanges, Optional,
  ChangeDetectionStrategy } from '@angular/core';
import { ScaleLinear, ScaleTime } from 'd3-scale';
import { applyMixins } from '../../../util/functions/mixins';
import { Stylable } from '../../../util/mixins/stylable';
import { ChartComponent } from '../../chart/chart.component';
import { BaseChartComponent } from '../../../util/interfaces/class-interfaces/base-chart-component';
import { ChartContainerComponent } from '../../chart-container/chart-container.component';
import { ContentContainer } from '../../../util/abstract-classes/content-container';
import { AxisSide } from '../../../util/interfaces/common-types/positioning';
import { AxisTheme } from '../../../util/theme/axis';
import { TickFormat } from '../../../util/interfaces/common-types/axis';
import { IndependentAxisType } from '../../../util/interfaces/common-types/data';

@Component({
  selector: 'g[i-ng-axis-tick]',
  templateUrl: './axis-tick.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AxisTickComponent
  extends applyMixins([Stylable])
  implements OnChanges, BaseChartComponent {
  /**
  * The specific style for the bar.
  */
  @Input() style: AxisTheme['axis'];
  @Input() side: AxisSide;
  @Input() scale: ScaleLinear | ScaleTime;
  @Input() tick: number | Date;
  /**
   * The function that will format the tick values into
   * better readable strings.
   */
  @Input() tickFormat: TickFormat;
  /**
   * An array that will explicitly set tick values. If `domain` is specified on the
   * containing iNgGroup directive, these values must be within that domain.
   */
  @Input() tickValues: IndependentAxisType[];
  @Input() index: number;

  rootStylePath = 'axis.ticks';
  container: ContentContainer;

  constructor(
    public chart: ChartComponent,
    @Optional() chartContainer: ChartContainerComponent
  ) {
    super();
    this.container = chartContainer || chart;
  }

  get x(): number {
    const { scale, side, tick } = this;
    if (side === 'left' || side === 'right') {
      return 0;
    }
    return scale(tick);
  }

  get y(): number {
    const { scale, side, tick } = this;
    if (side === 'top' || side === 'bottom') {
      return 0;
    }
    return scale(tick);
  }

  get transform(): string {
    const { x, y } = this;
    return `translate(${x}, ${y})`;
  }

  /**
   * Get the sign (positive or negative) that ticks and related elements
   * should adhere to when being drawn.
   */
  get drawingSign(): number {
    const { side } = this;
    const sign = side === 'left' || side === 'top' ? -1 : 1;
    return sign;
  }

  /**
   * Get the value of the `x2` attribute that the tick `<line>` element
   * should have.
   */
  get tickX2(): number | null {
    const { tick, index, side, drawingSign } = this;
    if (side === 'top' || side === 'bottom') {
      return null;
    }
    const tickSize = this.getStyleProp('axis.ticks.size', tick, index);
    return tickSize * drawingSign;
  }

  /**
   * Get the value of the `y2` attribute that the tick `<line>` element
   * should have.
   */
  get tickY2(): number | null {
    const { tick, index, side, drawingSign } = this;
    if (side === 'left' || side === 'right') {
      return null;
    }
    const tickSize = this.getStyleProp('axis.ticks.size', tick, index);
    return tickSize * drawingSign;
  }

  /**
   * Get the amount of padding that the tick label should have from its
   * tick line.
   * @param tick - The numerical value of the tick.
   * @param index - The index of this tick along the axis.
   */
  tickLabelSpacing(tick: number | Date, index: number): number {
    const { side } = this;
    const fontSize = this.getStyleProp('axis.ticks.labels.fontSize', tick, index);
    const fontNudge = fontSize * this.getStyleProp('global.fontNudgeRatio');
    const ticklabelFontSize = side === 'bottom' ? fontSize - fontNudge :
      side === 'top' ? fontNudge :
      0;
    const tickSize = this.getStyleProp('axis.ticks.size', tick, index);
    const tickLabelPadding = this.getStyleProp('axis.ticks.labels.padding', tick, index);
    return ticklabelFontSize + tickLabelPadding + tickSize;
  }

  /**
   * Get the amount of offset for the tick label in Y coordinates. (Some of the math has some
   * guesswork).
   */
  get tickLabelDy(): number {
    const { tick, index, side, drawingSign } = this;
    const tickLabelSpacing = this.tickLabelSpacing(tick, index);
    if (side === 'left' || side === 'right') {
      return this.getStyleProp('axis.ticks.labels.fontSize') / Math.PI; // For some reason, Math.PI centers ticks vertically on Y Axis
    }
    return tickLabelSpacing * drawingSign;
  }

  /**
   * Get the amount of offset for the tick label in X coordinates.
   */
  get tickLabelDx(): number | null {
    const { tick, index, side, drawingSign } = this;
    const tickLabelSpacing = this.tickLabelSpacing(tick, index);
    if (side === 'top' || side === 'bottom') {
      return null;
    }
    return tickLabelSpacing * drawingSign;
  }

  /**
   * Get the text anchor for the tick labels.
   */
  get tickLabelTextAnchor(): string {
    const { side } = this;
    if (side === 'top' || side === 'bottom') {
      return 'middle';
    }
    return side === 'right' ? 'start' : 'end';
  }

  /**
   * Formats the tick value according to the value of `tickFormat`.
   */
  get formattedTick(): string {
    const { tick, tickFormat, tickValues } = this;
    if (!tickFormat) {
      return tick.toString();
    }
    if (typeof tickFormat === 'function') {
      return tickFormat(tick);
    }
    return tickFormat[tickValues.indexOf(tick)] || tick.toString();
  }
}
