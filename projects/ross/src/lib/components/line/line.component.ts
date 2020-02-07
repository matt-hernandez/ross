import { Component, Input, Optional, ChangeDetectorRef,
  ChangeDetectionStrategy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { line, curveBasis, curveBundle, curveCardinal, curveCatmullRom, curveLinear,
  curveMonotoneX, curveMonotoneY, curveNatural, curveStep, curveStepAfter, curveStepBefore,
} from 'd3-shape';
import { interpolatePath } from 'd3-interpolate-path';
import { interpolateNumber } from 'd3-interpolate';
import { ChartComponent } from '../chart/chart.component';
import { ChartContainerComponent } from '../chart-container/chart-container.component';
import { GroupDirective } from '../../directives/group/group.directive';
import { ChartChildManagerService } from '../../services/chart-child-manager.service';
import { ContentContainer } from '../../util/abstract-classes/content-container';
import { LineTheme } from '../../util/theme/line';
import { VisualizerType } from '../../util/interfaces/common-types/drawing';
import { applyMixins } from '../../util/functions/mixins';
import { BaseChartComponent } from '../../util/interfaces/class-interfaces/base-chart-component';
import { Stylable } from '../../util/mixins/stylable';
import { DataVisualizable } from '../../util/mixins/data-visualizable';
import { Animatable } from '../../util/mixins/animatable';
import { preventAndReturnNull } from '../../util/decorators/prevent-and-return-null';
import { onlyForAnimation } from '../../util/decorators/only-for-animation';
import { dataNotValid } from '../../util/functions/data';
import { DataSubscribable } from '../../util/mixins/data-subscribable';
import { hasAnimation } from '../../util/decorators/has-animation';

let id = 0;

/**
 * This visualization draws a single line on a chart. It must be contained inside a {@link ChartComponent}.
 *
 * If you wish to reconcile multiple lines within one chart, place them inside a {@link GroupDirective}.
 * Otherwise, the lines will be drawn independently with their own scales.
 *
 * This visualization is compatible with {@link LinearData}, {@link TemporalData}, and {@link BandData}.
 * If using BandData, the value of `x` in the data will be used for the auto-generated axis. Options for
 * the auto-generated x-axis can be further explored in {@link ChartComponent}.
 *
 * @example
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
  selector: 'g[i-ng-line]',
  templateUrl: './line.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('iNgExit', [
      transition(':leave', [
        animate('{{ exit_time }}', style({ visibility: 'visible' })),
      ], {
        params: {
          exit_time: '0',
        }
      })
    ])
  ]
})
export class LineComponent extends
  applyMixins([DataVisualizable, Stylable, Animatable, DataSubscribable])
  implements BaseChartComponent {
  /**
   * Any styles to override.
   */
  @Input() style: LineTheme;
  @Input() curveFn = 'linear';
  readonly id = id++;
  @Input() name = `${this.constructor.name}${this.id}`;
  @ViewChild('lineEl') lineEl: ElementRef;

  rootStylePath = 'line';
  visualizerType: VisualizerType = 'Line';
  container: ContentContainer;
  hasViewInitialized = false;
  curveObj = {
    'basis': curveBasis,
    'bundle': curveBundle,
    'cardinal': curveCardinal,
    'catmullRom': curveCatmullRom,
    'linear': curveLinear,
    'monotoneX': curveMonotoneX,
    'monotoneY': curveMonotoneY,
    'natural': curveNatural,
    'step': curveStep,
    'stepAfter': curveStepAfter,
    'stepBefore': curveStepBefore,
  };

  private lineFn;

  constructor(public chart: ChartComponent,
    public chartChildManagerService: ChartChildManagerService,
    @Optional() chartContainer: ChartContainerComponent,
    public group: GroupDirective,
    public changeDetectorRef: ChangeDetectorRef,
    public renderer: Renderer2,
  ) {
    super();
    this.container = chartContainer || chart;
  }

  onDataUpdate(): void {
    const { group, curveFn, curveObj } = this;
    const { xScale, yScale } = group.scaleData;
    const upcomingLineFn = line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(curveObj[curveFn]);
    this.lineFn = upcomingLineFn;
  }

  afterDataUpdate(): void {
    this.checkForAnimation();
  }

  /**
   * Calculate the path of the line.
   */
  @hasAnimation({
    transitory: (from, to) => interpolatePath(from, to), // interpolate path will throw an error without wrapping function
    exit: (from, { data, lineFn }) => {
      const zeroData = data.map(d => ({ ...d, y: 0 }));
      const zeroPath = lineFn(zeroData);
      return interpolatePath(from, zeroPath);
    },
    nodeName: 'lineEl',
    attribute: 'd'
  })
  get d(): string | null {
    const { _dataRender, lineFn } = this;
    return lineFn(_dataRender);
  }

  /**
   * Return the value of the `stroke-dasharray` attribute of the `<path>` element
   * that is responsible for the line chart.
   */
  @preventAndReturnNull(({lineEl}) => !!lineEl)
  @onlyForAnimation
  @hasAnimation({
    enter: (to, { lineEl: { nativeElement } }) => {
      const totalLength = nativeElement.getTotalLength();
      return progress => progress === 1 ? to : `${totalLength} ${totalLength}`;
    },
    nodeName: 'lineEl',
    attribute: 'stroke-dasharray'
  })
  get strokeDasharray(): string {
    return null;
  }

  /**
   * Return `0` for the value of the `stroke-dashoffset` attribute of the `<path>` element
   * that is responsible for the line chart. This is activated at the very end of the beginning
   * animation.
   */
  @onlyForAnimation
  @hasAnimation({
    enter: (to, { lineEl: { nativeElement } }) => {
      const totalLength = nativeElement.getTotalLength();
      return interpolateNumber(totalLength, to);
    },
    nodeName: 'lineEl',
    attribute: 'stroke-dashoffset'
  })
  get strokeDashoffset(): number {
    return 0;
  }

  get shouldAnimate(): boolean {
    const { _dataRender, lineFn } = this;
    return !dataNotValid(_dataRender) && lineFn;
  }
}
