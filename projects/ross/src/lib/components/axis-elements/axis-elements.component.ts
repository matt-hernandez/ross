import { Component, Optional, OnInit, ChangeDetectionStrategy, Renderer2, ChangeDetectorRef, Input,
  DoCheck } from '@angular/core';
import { ScaleLinear, ScaleTime } from 'd3-scale';
import { interpolateArray } from 'd3-interpolate';
import { ChartComponent } from '../chart/chart.component';
import { ChartContainerComponent } from '../chart-container/chart-container.component';
import { BaseChartComponent } from '../../util/interfaces/class-interfaces/base-chart-component';
import { ContentContainer } from '../../util/abstract-classes/content-container';
import { applyMixins } from '../../util/functions/mixins';
import { Stylable } from '../../util/mixins/stylable';
import { DataSubscribable } from '../../util/mixins/data-subscribable';
import { GroupDirective } from '../../directives/group/group.directive';
import { AxisElementsType, IndependentAxisType, UnifiedPoints, DatumWithOriginName } from '../../util/interfaces/common-types/data';
import { ChartChildManagerService } from '../../services/chart-child-manager.service';
import { AxisComponent } from '../axis/axis.component';
import { preventAndReturnNull } from '../../util/decorators/prevent-and-return-null';
import { AxisBarAlignment } from '../../util/interfaces/common-types/positioning';
import { AxisElementsTheme } from '../../util/theme/axis-elements';
import { Animatable } from '../../util/mixins/animatable';

@Component({
  selector: 'g[i-ng-axis-elements]',
  templateUrl: './axis-elements.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AxisElementsComponent
  extends applyMixins([Stylable, DataSubscribable, Animatable])
  implements OnInit, DoCheck, BaseChartComponent {
  /**
   * Any styles to override.
   */
  @Input() style: AxisElementsTheme;
  /**
   * What type of elements to render.
   */
  @Input() type: AxisElementsType = 'bars';
  /**
   * The alignemnt for axis bars, if they're being used.
   */
  @Input() barAlignment: AxisBarAlignment = 'start';
  /**
   * The name of the axis to match these elements against. Use `'defaultIndependent'` for an
   * auto-generated x-axis and `'defaultDependent'` for an auto-generated y-axis.
   */
  @Input() axisName;

  container: ContentContainer;
  rootStylePath = 'axisElements';
  unifiedPoints: UnifiedPoints[];

  private axis: AxisComponent;
  private ticks: IndependentAxisType[];
  private scale: ScaleLinear | ScaleTime;
  private previousScale: ScaleLinear | ScaleTime;

  constructor(
    public chart: ChartComponent,
    @Optional() chartContainer: ChartContainerComponent,
    private chartChildManagerService: ChartChildManagerService,
    public group: GroupDirective,
    public renderer: Renderer2,
    public changeDetectorRef: ChangeDetectorRef
  ) {
    super();
    this.container = chartContainer || chart;
  }

  ngOnInit(): void {
    super.ngOnInit();
    const { chartChildManagerService } = this;
    chartChildManagerService.registerAxisElementsWithChart(this);
  }

  ngDoCheck(): void {
    super.ngDoCheck();
    const { axis, chartChildManagerService } = this;
    if (!axis) {
      this.axis = chartChildManagerService.getCorrespondingAxisForElements(this);
    }
  }

  onDataUpdate(): void {
    const { axis, group, scale: previousScale } = this;
    const { xScale, yScale } = group.scaleData;
    const { unifiedDomain: { unifiedXPoints, unifiedYPoints } } = group;
    const { axisType } = axis;
    const scale = axisType === 'independent' ? xScale : yScale;
    this.unifiedPoints = axisType === 'independent' ? unifiedXPoints : unifiedYPoints;
    this.ticks = AxisComponent.generateTicksAsAService(scale, axis.tickCount, axis.tickValues);
    this.previousScale = previousScale || scale;
    this.scale = scale;
  }

  afterDataUpdate(): void {
    const { scale, previousScale, axis } = this;
    const previousDomain = previousScale.domain();
    const domain = scale.domain();
    const interpolator = interpolateArray(previousDomain, domain);
    this.kickOffChangeDetectionCycle((progress) => {
      this.scale = this.scale.copy().domain(interpolator(progress));
      this.ticks = AxisComponent.generateTicksAsAService(this.scale, axis.tickCount, axis.tickValues);
    });
  }

  /**
   * The style object to pass to the individual bars, grids, or cross sections, whether its the default styling or an
   * object passed into the `style` input.
   */
  get resolveStyle(): any {
    const { type } = this;
    return this.getStyleProp(`axisElements.${type}`);
  }

  /**
   * This getter returns a boolean representing whether or not a preceding axis bar should be appended
   * to the chart before all the others. This will only be the case the if the bar alignment is `'start'`
   * and there is some kind of domain padding.
   */
  @preventAndReturnNull(({ ticks, scale, axis }) => !!ticks && !!scale && !!axis)
  get shouldHaveBeginningBar(): boolean {
    const { scale, ticks, barAlignment } = this;
    const [ beginning ] = scale.domain();
    return beginning < ticks[0] && barAlignment === 'start';
  }

  /**
   * Find the value of the left side of the bar, if using horizontal axis bars, or the bottom side
   * of the bar if using vertical axis bars.
   * @param index - The index of the axis bar.
   */
  resolveBarStartValue(index: number): number {
    const { barAlignment, scale, ticks, axis } = this;
    const currentPoint = scale(ticks[index]);
    if (barAlignment === 'start') {
      return currentPoint;
    }
    const startIndex = index - 1;
    if (startIndex < 0) {
      const { container: { height } } = this;
      return axis.axisType === 'independent' ? 0 : height;
    }
    const previousPoint = scale(ticks[startIndex]);
    const distance = currentPoint - previousPoint;
    const halfwayBack = distance / 2;
    const startValue = previousPoint + halfwayBack;
    return startValue;
  }

  /**
   * Find the value of the right side of the bar, if using horizontal axis bars, or the top side
   * of the bar if using vertical axis bars.
   * @param index - The index of the axis bar.
   */
  resolveBarEndValue(index: number): number {
    const { barAlignment, scale, ticks, axis } = this;
    const currentPoint = scale(ticks[index]);
    const endIndex = index + 1;
    if (endIndex === ticks.length) {
      const { container: { width } } = this;
      return axis.axisType === 'independent' ? width : 0;
    }
    const nextPoint = scale(ticks[endIndex]);
    if (barAlignment === 'start') {
      return nextPoint;
    }
    const distance = nextPoint - currentPoint;
    const halfwayForward = distance / 2;
    const endValue = currentPoint + halfwayForward;
    return endValue;
  }

  /**
   * Find the destination `x2` point of the grid `<line>` element that will be used for the
   * axis grid line.
   * @param tick - The tick value
   */
  getGridX(tick): number {
    const { axis, scale, container: { width } } = this;
    const axisType = axis.axisType;
    if (axisType === 'independent') {
      return scale(tick);
    }
    return width;
  }

  /**
   * Find the destination `y2` point of the grid `<line>` element that will be used for the
   * axis grid line.
   * @param tick - The tick value
   */
  getGridY(tick): number {
    const { axis, scale, container: { height } } = this;
    const axisType = axis.axisType;
    if (axisType === 'dependent') {
      return scale(tick);
    }
    return height;
  }

  /**
   * Find the destination `x2` point of the grid `<line>` element that will be used for the
   * cross section line.
   * @param tick - The cross section point
   */
  getCrossSectionX(point: DatumWithOriginName): number {
    const { axis, scale, container: { width } } = this;
    const axisType = axis.axisType;
    if (axisType === 'independent') {
      return scale(point.x);
    }
    return width;
  }

  /**
   * Find the destination `y2` point of the grid `<line>` element that will be used for the
   * cross section line.
   * @param tick - The cross section point
   */
  getCrossSectionY(point: DatumWithOriginName): number {
    const { axis, scale, container: { height } } = this;
    const axisType = axis.axisType;
    if (axisType === 'dependent') {
      return scale(point.y);
    }
    return height;
  }

  barTrackBy(index: number, bar: number | Date): any {
    return bar.valueOf();
  }

  get shouldAnimate(): boolean {
    const { scale } = this;
    return !!scale;
  }
}
