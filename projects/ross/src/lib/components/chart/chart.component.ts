import { Component, Input, AfterContentInit, ChangeDetectionStrategy, ContentChildren, QueryList } from '@angular/core';
import { Padding } from '../../util/interfaces/common-types/positioning';
import { ContentContainerPadded } from '../../util/abstract-classes/content-container-padded';
import { IndependentAxisType, DependentAxisType } from '../../util/interfaces/common-types/data';
import { ChartChildManagerService } from '../../services/chart-child-manager.service';
import { theme as defaultTheme, Theme } from '../../util/theme';
import { AxisTheme } from '../../util/theme/axis';
import { DOMDependentDirective } from '../../directives/dom-dependent/dom-dependent.directive';
import { TickFormat } from '../../util/interfaces/common-types/axis';

/**
 * This is the root component for rendering all charts. In order to render content
 * inside of the padded area, surround it in a `<g>` tag with an attribute of
 * `[i-ng-chart-container]`.
 *
 * If only one data visualization exists inside the chart, x and y axes will be
 * auto-generated IF no axes exist in the chart content already.
 *
 * If there are multiple data visualizations inside the chart, x and y axes can
 * still be auto-generated by surrounding the visualizations in a `<g>` tag or an `<ng-container>`
 * with a `iNgGroup` directive on either one. If the data on the `x` axis for all visualizations
 * is of the same type (i.e. all dates, all numbers, or all strings), then axes will be auto-generated.
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
 *                ></g>
 *                <ng-container iNgGroup>
 *                  <g i-ng-line
 *                    [data]="[{ x: 'Jan', y: 1 }, { x: 'Feb', y: 3 }, { x: 'Mar', y: 3 }, { x: 'Apr', y: 5 },
 *                      { x: 'May', y: 4 }, { x: 'Jun', y: 6 }]"
 *                  ></g>
 *                  <g i-ng-line
 *                    [data]="[{ x: 'Feb', y: 2 }, { x: 'Mar', y: 3 }, { x: 'Apr', y: 5 }, { x: 'May', y: 7 },
 *                      { x: 'Jun', y: 6 }, { x: 'July', y: 9 }]"
 *                  ></g>
 *                </ng-container>
 *              </svg:g>
 * </i-ng-chart>
 *
 * <i-ng-chart [padding]="50">
 *              <svg:g i-ng-chart-container>
 *                <ng-container iNgGroup>
 *                  <g i-ng-line
 *                    [data]="[{ x: 'Jan', y: 1 }, { x: 'Feb', y: 3 }, { x: 'Mar', y: 3 }, { x: 'Apr', y: 5 },
 *                      { x: 'May', y: 4 }, { x: 'Jun', y: 6 }]"
 *                  ></g>
 *                  <g i-ng-line
 *                    [data]="[{ x: 'Feb', y: 2 }, { x: 'Mar', y: 3 }, { x: 'Apr', y: 5 }, { x: 'May', y: 7 },
 *                      { x: 'Jun', y: 6 }, { x: 'July', y: 9 }]"
 *                  ></g>
 *                </ng-container>
 *              </svg:g>
 * </i-ng-chart>
 *
 * <i-ng-chart [padding]="50">
 *              <svg:g i-ng-chart-container>
 *                <g i-ng-line
 *                  [data]="[{ x: 'Jan', y: 1 }, { x: 'Feb', y: 3 }, { x: 'Mar', y: 3 }, { x: 'Apr', y: 5 },
 *                    { x: 'May', y: 4 }, { x: 'Jun', y: 6 }]"
 *                ></g>
 *              </svg:g>
 * </i-ng-chart>
 */
@Component({
  selector: 'i-ng-chart',
  templateUrl: './chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ChartChildManagerService
  ]
})
export class ChartComponent extends ContentContainerPadded implements AfterContentInit {
  /**
   * The width of the SVG canvas.
   */
  @Input() width = 450;
  /**
   * The height of the SVG canvas.
   */
  @Input() height = 300;
  /**
   * The amount of whitespace padding around the chart area. X and Y axes are drawn
   * outside the chart area, so this attribute can be useful for providing the right
   * amount of space for X and Y labels.
   */
  @Input() padding: number | Padding = 50;
  /**
   * Formatting for the x axis, if relying on the chart to auto-generate axes.
   */
  @Input() xTickFormat: TickFormat;
  /**
   * Formatting for the y axis, if relying on the chart to auto-generate axes.
   */
  @Input() yTickFormat: TickFormat;
  /**
   * The suggested tick count for the x axis.
   */
  @Input() xTickCount = 5;
  /**
   * The suggested tick count for the y axis.
   */
  @Input() yTickCount = 5;
  /**
   * Predefined x axis values, if relying on the chart to auto-generate axes.
   */
  @Input() xTickValues: IndependentAxisType[];
  /**
   * Predefined y axis values, if relying on the chart to auto-generate axes.
   */
  @Input() yTickValues: DependentAxisType[];
  /**
   * X axis label, if relying on the chart to auto-generate axes.
   */
  @Input() xLabelText: string;
  /**
   * Y axis label, if relying on the chart to auto-generate axes.
   */
  @Input() yLabelText: string;
  /**
   * X axis styles to override.
   */
  @Input() xAxisStyle: AxisTheme;
  /**
   * Y axis styles to override.
   */
  @Input() yAxisStyle: AxisTheme;
  /**
   * The theme to use for all child components used inside the chart.
   */
  @Input() theme: Theme = defaultTheme;
  @ContentChildren(DOMDependentDirective, { descendants: true }) topLevelChildren: QueryList<DOMDependentDirective>;

  shouldRenderOwnAxes = false;
  shouldRenderAxisContainer = false;

  constructor(private chartChildManagerService: ChartChildManagerService) {
    super();
  }

  /**
   * This Angular lifecycle method checks to see if auto-generated axes should
   * be made. If so, it will calculate the data necessary for that.
   */
  ngAfterContentInit(): void {
    const { chartChildManagerService } = this;
    const chartGroups = chartChildManagerService.getChartGroups();
    if (chartGroups.length > 1) {
      return;
    }
    const hasAxes = chartChildManagerService.chartHasAxes();
    if (hasAxes) {
      return;
    }
    const shouldRenderOwnAxes = !hasAxes;
    this.shouldRenderOwnAxes = shouldRenderOwnAxes;
    const hasContainer = chartChildManagerService.chartHasContainer();
    this.shouldRenderAxisContainer = shouldRenderOwnAxes && hasContainer;
  }

  getChildComponentsOfType<T>(component: T): Array<T> {
    const { topLevelChildren } = this;
    const componentsArray = topLevelChildren.toArray();
    return componentsArray
      .filter(child => child.componentName === component.constructor.name)
      .map(child => child.component);
  }
}
