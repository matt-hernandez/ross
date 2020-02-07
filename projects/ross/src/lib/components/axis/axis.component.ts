import { Component, Input, OnInit, Optional, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy, Renderer2 } from '@angular/core';
import { ScaleLinear, ScaleTime } from 'd3-scale';
import { interpolateArray } from 'd3-interpolate';
import { ChartComponent } from '../chart/chart.component';
import { ChartContainerComponent } from '../chart-container/chart-container.component';
import { ChartChildManagerService } from '../../services/chart-child-manager.service';
import { ContentContainer } from '../../util/abstract-classes/content-container';
import { AxisSide } from '../../util/interfaces/common-types/positioning';
import { AxisTheme } from '../../util/theme/axis';
import { AxisType, IndependentAxisType } from '../../util/interfaces/common-types/data';
import { GroupDirective } from '../../directives/group/group.directive';
import { BaseChartComponent } from '../../util/interfaces/class-interfaces/base-chart-component';
import { Stylable } from '../../util/mixins/stylable';
import { applyMixins } from '../../util/functions/mixins';
import { DataSubscribable } from '../../util/mixins/data-subscribable';
import { preventAndReturnNull } from '../../util/decorators/prevent-and-return-null';
import { TickFormat } from '../../util/interfaces/common-types/axis';
import { Animatable } from '../../util/mixins/animatable';

/**
 * An axis moving in any direction. If using this axis with either numbers or Dates, the
 * `domain` input can be used to specify the range to draw.
 *
 * If using this axis for Band data, specify numerical `tickValues` with a `tickFormat` value.
 * Use this along with `domain` if you want clear points labeled on the axis, but don't want
 * to label every point.
 *
 * If placed inside a `iNgGroup` directive, the axis line will honor the content area,
 * but ticks and tick labels will be extended outside the content area. Adjust the
 * `style` input to determine how far outside the content area the ticks and tick labels
 * should extend.
 *
 * @example
 * <i-ng-chart [padding]="50">
 *              <svg:g i-ng-chart-container>
 *                <g i-ng-axis
 *                  [tickValues]="[0, 1, 2, 3, 4, 5, 6]"
 *                  [tickFormat]="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']"
 *                  [labelText]="'X Axis'"
 *                ></g>
 *                <g i-ng-axis
 *                  [domain]="[1, 9]"
 *                  [side]="'left'"
 *                  [labelText]="'Y Axis'"
 *                ></g>
 *                <g i-ng-axis
 *                  [domain]="[1, 9]"
 *                  [side]="'right'"
 *                  [labelText]="'Right Y Axis'"
 *                ></g>
 *                <g i-ng-axis
 *                  [domain]="[0, 6]"
 *                  [tickValues]="[0, 3, 6]"
 *                  [tickFormat]="['Jan', 'Apr', 'Jul']"
 *                  [labelText]="'Top X Axis'"
 *                ></g>
 *              </svg:g>
 * </i-ng-chart>
 */

@Component({
  selector: 'g[i-ng-axis]',
  templateUrl: './axis.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AxisComponent
  extends applyMixins([Stylable, DataSubscribable, Animatable])
  implements OnInit, OnDestroy, BaseChartComponent {
  /**
   * Any styles to override.
   */
  @Input() style: AxisTheme;
  /**
   * What side of the axis the ticks will appear on
   */
  @Input() side: AxisSide = 'bottom';
  /**
   * The function that will format the tick values into
   * better readable strings.
   */
  @Input() tickFormat: TickFormat;
  /**
   * Specifies approximately how many ticks should be drawn on the axis. This
   * value will be disregarded if `tickValues` is specified.
   */
  @Input() tickCount = 5;
  /**
   * An array that will explicitly set tick values. If `domain` is specified on the
   * containing iNgGroup directive, these values must be within that domain.
   */
  @Input() tickValues: IndependentAxisType[];
  /**
   * The label for this y axis.
   */
  @Input() labelText: string;
  /**
   * Whether this axis is meant to measure the independent or dependent variable.
   */
  @Input() axisType: AxisType = 'independent';
  /**
   * The name of the axis. This string is used to match up axis elements to their
   * appropriate axis. Avoid using the word 'default' when creating custom axes, since
   * the word is reserved for auto-generated axes.
   */
  @Input() name;

  rootStylePath = 'axis';
  ticks: number[] = [];
  container: ContentContainer;

  private scale: ScaleLinear | ScaleTime;
  private previousScale: ScaleLinear | ScaleTime;
  private getGroupBeforeSuperOnInit = false;

  constructor(public chart: ChartComponent,
    private chartChildManagerService: ChartChildManagerService,
    @Optional() chartContainer: ChartContainerComponent,
    @Optional() public group: GroupDirective,
    public changeDetectorRef: ChangeDetectorRef,
    public renderer: Renderer2
  ) {
    super();
    this.container = chartContainer || chart;
    this.getGroupBeforeSuperOnInit = !group;
  }

  ngOnInit(): void {
    const { getGroupBeforeSuperOnInit, chartChildManagerService } = this;
    if (getGroupBeforeSuperOnInit) {
      let { group } = this;
      [ group ] = chartChildManagerService.getChartGroups();
      this.group = group;
    }
    super.ngOnInit();
    chartChildManagerService.registerAxisWithChart(this);
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    const { chartChildManagerService } = this;
    chartChildManagerService.unregisterAxisWithChart(this);
  }

  /**
   * This function is called whenever data in the group is updated.
   */
  onDataUpdate(): void {
    const { axisType, scale: previousScale } = this;
    const { xScale, yScale } = this.group.scaleData;
    const scale = axisType === 'independent' ? xScale : yScale;
    this.previousScale = previousScale || scale;
    this.scale = scale;
  }

  /**
   * This function is called after data update and interpolates between the
   * new scales.
   */
  afterDataUpdate(): void {
    const { scale, previousScale } = this;
    const previousDomain = previousScale.domain();
    const domain = scale.domain();
    const interpolator = interpolateArray(previousDomain, domain);
    this.kickOffChangeDetectionCycle((progress) => {
      this.scale = this.scale.copy().domain(interpolator(progress));
    });
  }

  /**
   * This function generates the ticks that will be rendered on the axis.
   */
  @preventAndReturnNull(({scale}) => scale)
  generateTicks(): IndependentAxisType[] {
    const { tickValues, scale, tickCount } = this;
    return AxisComponent.generateTicksAsAService(scale, tickCount, tickValues);
  }

  /* tslint:disable */
  static generateTicksAsAService(scale, tickCount, tickValues?): IndependentAxisType[] {
    if (tickValues) {
      const [start, end] = scale.domain();
      return tickValues.filter(tickValue => tickValue >= start && tickValue <= end);
    }
    return scale.ticks(tickCount);
  }
  /* tslint:enable */

  /**
   * Get the translate function string for the axis line, tick, and
   * tick labels container.
   */
  get axisTranslate(): string {
    const { side, container: { top, right, bottom } } = this;
    if (side === 'top' || side === 'bottom') {
      const verticalTranslate = side === 'bottom' ? bottom : top;
      return `translate(0, ${verticalTranslate})`;
    }
    if (side === 'right') {
      return `translate(${right}, 0)`;
    }
    return `translate(0, 0)`;
  }

  /**
   * Get the x position of the axis label.
   */
  get axisLabelXPosition(): number {
    const { side, container: { centerX, right } } = this;
    if (side === 'top' || side === 'bottom') {
      return centerX;
    }
    const { drawingSign } = this;
    const spacing = this.getStyleProp('axis.axis.label.padding') * drawingSign;
    if (side === 'left') {
      return spacing;
    }
    if (side === 'right') {
      return right + spacing;
    }
  }

  /**
   * Get the y position of the axis label.
   */
  get axisLabelYPosition(): number {
    const { side } = this;
    const { container: { centerY } } = this;
    if (side === 'left' || side === 'right') {
      return centerY;
    }
    const { container: { bottom, top }, drawingSign } = this;
    const verticalPosition = side === 'top' ? top - 4 : bottom + this.getStyleProp('axis.axis.label.fontSize');
    const labelYPosition = verticalPosition +
      this.getStyleProp('axis.axis.label.padding') * drawingSign;
    return labelYPosition;
  }

  /**
   * Get the axis label rotation function string.
   */
  get axisLabelRotation(): string | null {
    const { side } = this;
    if (side === 'top' || side === 'bottom') {
      return null;
    }
    const { axisLabelXPosition, axisLabelYPosition } = this;
    const rotation = side === 'left' ? -90 : 90;
    return `rotate(${rotation}, ${axisLabelXPosition}, ${axisLabelYPosition})`;
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
   * Get the value of the `x2` attribute that the axis `<line>` element
   * should have.
   */
  get axisX2(): number | null {
    const { side, container: { right } } = this;
    if (side === 'left' || side === 'right') {
      return null;
    }
    return right;
  }

  /**
   * Get the value of the `y2` attribute that the axis `<line>` element
   * should have.
   */
  get axisY2(): number | null {
    const { side, container: { bottom } } = this;
    if (side === 'top' || side === 'bottom') {
      return null;
    }
    return bottom;
  }

  get shouldAnimate(): boolean {
    const { scale } = this;
    return !!scale;
  }
}
