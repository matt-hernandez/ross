import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { AxisTheme } from '../../util/theme/axis';
import { IndependentAxisType, DependentAxisType } from '../../util/interfaces/common-types/data';
import { TickFormat } from '../../util/interfaces/common-types/axis';

/**
 * This component is used to draw a common pair of bottomside X axis and
 * left side Y axis.
 *
 * @example
 * <i-ng-chart [padding]="50">
 *              <svg:g i-ng-chart-container>
 *                <g i-ng-common-axis-pair
 *                  [xTickValues]="[0, 3, 6]"
 *                  [xTickFormat]="['Jan', 'Apr', 'Jul']"
 *                  [xLabelText]="'X Axis'"
 *                  [yDomain]="[1, 9]"
 *                  [yLabelText]="'Y Axis'"
 *                ></g>
 *              </svg:g>
 * </i-ng-chart>
 */
@Component({
  selector: 'g[i-ng-common-axis-pair]',
  templateUrl: './common-axis-pair.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonAxisPairComponent {
  /**
   * The tick format for the x axis.
   */
  @Input() xTickFormat: TickFormat;
  /**
   * The tick format for the y axis.
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
   * Explicitly set tick values for the x axis.
   */
  @Input() xTickValues: IndependentAxisType[];
  /**
   * Explicitly set tick values for the y axis.
   */
  @Input() yTickValues: DependentAxisType[];
  /**
   * The label for the x axis.
   */
  @Input() xLabelText: string;
  /**
   * The label for the y axis.
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
}
