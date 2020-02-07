import { Component, Input, OnChanges, ChangeDetectorRef, Optional,
  ChangeDetectionStrategy, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { interpolateNumber, interpolateTransformSvg } from 'd3-interpolate';
import { path } from 'd3-path';
import { symbols } from 'd3-shape';
import { applyMixins } from '../../../util/functions/mixins';
import { Animatable } from '../../../util/mixins/animatable';
import { Stylable } from '../../../util/mixins/stylable';
import { ScatterTheme } from '../../../util/theme/scatter';
import { ChartComponent } from '../../chart/chart.component';
import { BaseChartComponent } from '../../../util/interfaces/class-interfaces/base-chart-component';
import { ChartContainerComponent } from '../../chart-container/chart-container.component';
import { ContentContainer } from '../../../util/abstract-classes/content-container';
import { YScale, XScale } from '../../../util/interfaces/common-types/drawing';
import { Symbol } from '../../../util/interfaces/common-types/symbol';
import { GroupDirective } from '../../../directives/group/group.directive';
import { SingleDatumHolder } from '../../../util/mixins/single-datum-holder';
import { DataSubscribable } from '../../../util/mixins/data-subscribable';
import { hasAnimation } from '../../../util/decorators/has-animation';

@Component({
  selector: 'g[i-ng-scatter-point]',
  templateUrl: './scatter-point.component.html',
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
export class ScatterPointComponent
  extends applyMixins([Animatable, Stylable, SingleDatumHolder, DataSubscribable])
  implements OnChanges, BaseChartComponent {
  /**
  * The specific style for the scatter.
  */
  @Input() style: ScatterTheme['data'];
  /**
   * The shape of data points.
   */
  @Input() pointShape: Symbol | string = 'circle';

  @ViewChild('animatingNode') animatingNode: ElementRef;
  rootStylePath = 'scatter.data';
  container: ContentContainer;

  private xScale: XScale;
  private yScale: YScale;

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    public chart: ChartComponent,
    @Optional() chartContainer: ChartContainerComponent,
    public group: GroupDirective,
    public renderer: Renderer2
  ) {
    super();
    this.container = chartContainer || chart;
  }

  onDataUpdate(): void {
    const { xScale, yScale } = this.group.scaleData;
    this.xScale = xScale;
    this.yScale = yScale;
  }

  afterDataUpdate(): void {
    this.checkForAnimation();
  }

  /**
   * The value of the `fill` attribute on the `<circle>` element.
   */
  get fill(): string {
    const { datum } = this;
    return this.getStyleProp('scatter.data.fill', datum.x, datum.y);
  }

  /**
   * The fill opacity of the scatter points.
   */
  @hasAnimation({
    enter: to => interpolateNumber(0, to),
    exit: from => interpolateNumber(from, 0),
    nodeName: 'animatingNode',
    attribute: 'fill-opacity'
  })
  get fillOpacity(): number {
    return 1;
  }

  /**
   * The stroke opacity of the scatter points.
   */
  @hasAnimation({
    enter: to => interpolateNumber(0, to),
    exit: from => interpolateNumber(from, 0),
    nodeName: 'animatingNode',
    attribute: 'stroke-opacity'
  })
  get strokeOpacity(): number {
    return 1;
  }

  /**
   * Where this point lies on the x-axis
   */
  get x(): number {
    const { datum: { x }, xScale } = this;
    return xScale(x);
  }

  /**
   * Where this point lies on the y-axis
   */
  get y(): number {
    const { datum: { y }, yScale } = this;
    return yScale(y);
  }

  /**
   * The value of the radius attribute on the point shape element.
   */
  get radius(): number {
    const radius = this.getStyleProp('scatter.data.radius');
    return Math.pow(radius, 2);
  }

  /**
   * The path directional data.
   */
  get d(): string | null {
    const context = path();
    const symbolType = typeof Symbol[this.pointShape] === 'number' ? Symbol[this.pointShape] :
      Symbol[Symbol[this.pointShape]];
    const symbol = symbols[symbolType];
    symbol.draw(context, this.radius);
    return context.toString();
  }

  /**
   * This transform takes the `x` and `y` attributes and turns it into an SVG transform.
   */
  @hasAnimation({
    enter: (transform, { x, container: { height } }) => {
      return interpolateTransformSvg(`translate(${x}, ${height})`, transform);
    },
    transitory: interpolateTransformSvg,
    exit: (transform, { x, container: { height } }) => {
      return interpolateTransformSvg(transform, `translate(${x}, ${height})`);
    },
    nodeName: 'animatingNode',
    attribute: 'transform'
  })
  get transform(): string {
    const { x, y } = this;
    return `translate(${x}, ${y})`;
  }

  get shouldAnimate(): boolean {
    const { datum, yScale, xScale } = this;
    return !!datum && !!yScale && !!xScale;
  }
}
