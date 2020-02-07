import { Component, Input, Optional, ChangeDetectorRef,
  ChangeDetectionStrategy, ViewChild, ElementRef, Renderer2, Self } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { area, curveBasis, curveBundle, curveCardinal, curveCatmullRom, curveLinear,
  curveMonotoneX, curveMonotoneY, curveNatural, curveStep, curveStepAfter, curveStepBefore,
} from 'd3-shape';
import { interpolatePath } from 'd3-interpolate-path';
import { interpolateLab } from 'd3-interpolate';
import { ChartComponent } from '../chart/chart.component';
import { ChartContainerComponent } from '../chart-container/chart-container.component';
import { GroupDirective } from '../../directives/group/group.directive';
import { ChartChildManagerService } from '../../services/chart-child-manager.service';
import { ContentContainer } from '../../util/abstract-classes/content-container';
import { AreaTheme } from '../../util/theme/area';
import { VisualizerType } from '../../util/interfaces/common-types/drawing';
import { applyMixins } from '../../util/functions/mixins';
import { BaseChartComponent } from '../../util/interfaces/class-interfaces/base-chart-component';
import { Stylable } from '../../util/mixins/stylable';
import { DataVisualizable } from '../../util/mixins/data-visualizable';
import { Animatable } from '../../util/mixins/animatable';
import { dataNotValid } from '../../util/functions/data';
import { DataSubscribable } from '../../util/mixins/data-subscribable';
import { hasAnimation } from '../../util/decorators/has-animation';
import { DOMDependendable } from '../../util/mixins/dom-dependendable';
import { DOMDependentDirective } from '../../directives/dom-dependent/dom-dependent.directive';

let id = 0;

@Component({
  selector: 'g[i-ng-area]',
  templateUrl: './area.component.html',
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

export class AreaComponent
  extends applyMixins([Stylable, DataVisualizable, Animatable, DataSubscribable, DOMDependendable])
  implements BaseChartComponent {
  /**
   * Any styles to override.
   */
  @Input() style: AreaTheme;
  readonly id = id++;
  /**
   * The name of this visualization. This property will become useful in tooltips. If no name
   * is provided, it defaults to the constructor name with an ID number concatenated to the end.
   */
  @Input() name = `${this.constructor.name}${this.id}`;
  /**
   * The curve function for the area chart.
   */
  @Input() curveFn = 'linear';
  @ViewChild('areaEl') areaEl: ElementRef;

  rootStylePath = 'area';
  visualizerType: VisualizerType = 'Area';
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

  private areaFn;

  constructor(public chart: ChartComponent,
    public chartChildManagerService: ChartChildManagerService,
    @Optional() chartContainer: ChartContainerComponent,
    // public group: GroupDirective,
    public changeDetectorRef: ChangeDetectorRef,
    public elementRef: ElementRef,
    public renderer: Renderer2,
    @Self() public domDependent: DOMDependentDirective
  ) {
    super();
    this.container = chartContainer || chart;
  }

  onDataUpdate(): void {
    // const { group, curveFn, curveObj } = this;
    // const { xScale, yScale } = group.scaleData;
    // const upcomingAreaFn = area()
    //   .x(d => xScale(d.x))
    //   .y1(d => yScale(d.y))
    //   .y0(d => yScale(0))
    //   .curve(curveObj[curveFn]);
    // this.areaFn = upcomingAreaFn;
  }

  afterDataUpdate(): void {
    this.checkForAnimation();
  }

  get shouldAnimate(): boolean {
    const { _dataRender, areaFn } = this;
    return !dataNotValid(_dataRender) && areaFn;
  }

  @hasAnimation({
    enter: (to, { data, areaFn }) => {
      const zeroData = data.map(d => ({ ...d, y: 0 }));
      const zeroPath = areaFn(zeroData);
      return interpolatePath(zeroPath, to);
    },
    transitory: (from, to) => interpolatePath(from, to), // interpolate path will throw an error without wrapping function
    exit: (from, { data, areaFn }) => {
      const zeroData = data.map(d => ({ ...d, y: 0 }));
      const zeroPath = areaFn(zeroData);
      return interpolatePath(from, zeroPath);
    },
    nodeName: 'areaEl',
    attribute: 'd'
  })
  get d(): string | null {
    const { _dataRender, areaFn } = this;
    return areaFn(_dataRender);
  }

  @hasAnimation({
    transitory: interpolateLab,
    nodeName: 'areaEl',
    attribute: 'fill'
  })
  get fill(): string {
    return this.getStyleProp('area.data.fill');
  }
}
