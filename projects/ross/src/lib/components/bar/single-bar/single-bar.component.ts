import { Component, Input, OnChanges, ChangeDetectorRef, Optional,
  ChangeDetectionStrategy, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { scaleLinear } from 'd3-scale';
import { interpolateNumber } from 'd3-interpolate';
import { applyMixins } from '../../../util/functions/mixins';
import { Animatable } from '../../../util/mixins/animatable';
import { Stylable } from '../../../util/mixins/stylable';
import { BarTheme } from '../../../util/theme/bar';
import { ChartComponent } from '../../chart/chart.component';
import { BaseChartComponent } from '../../../util/interfaces/class-interfaces/base-chart-component';
import { ChartContainerComponent } from '../../chart-container/chart-container.component';
import { ContentContainer } from '../../../util/abstract-classes/content-container';
import { YScale, XScale } from '../../../util/interfaces/common-types/drawing';
import { GroupDirective } from '../../../directives/group/group.directive';
import { SingleDatumHolder } from '../../../util/mixins/single-datum-holder';
import { DataSubscribable } from '../../../util/mixins/data-subscribable';
import { hasAnimation } from '../../../util/decorators/has-animation';

@Component({
  selector: 'g[i-ng-single-bar]',
  templateUrl: './single-bar.component.html',
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
export class SingleBarComponent
  extends applyMixins([Animatable, Stylable, SingleDatumHolder, DataSubscribable])
  implements OnChanges, BaseChartComponent {
  /**
  * The specific style for the bar.
  */
  @Input() style: BarTheme['data'];
  @Input() spread: number;
  @Input() visualizerTypeIndex: number;
  @Input() visualizerTypeLength: number;
  @ViewChild('animatingNode') animatingNode: ElementRef;

  rootStylePath = 'bar.data';
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
   * The value of the `width` attribute on the `<rect>` element.
   */
  get width(): number {
    const { datum } = this;
    return this.getStyleProp('bar.data.width', datum.x, datum.y);
  }

  /**
   * The value of the `height` attribute on the `<rect>` element.
   */
  @hasAnimation({
    enter: (to) => interpolateNumber(0, to),
    transitory: interpolateNumber,
    exit: (from) => interpolateNumber(from, 0),
    nodeName: 'animatingNode',
    attribute: 'height'
  })
  get height(): number {
    const { container: { height }, y } = this;
    return height - y;
  }

  /**
   * The value of the `fill` attribute on the `<rect>` element.
   */
  get fill(): string {
    const { datum } = this;
    return this.getStyleProp('bar.data.fill', datum.x, datum.y);
  }

  /**
   * The value of the `x` attribute on the `<rect>` element.
   */
  @hasAnimation({
    transitory: interpolateNumber,
    exit: (from, { x }) => interpolateNumber(from, x),
    nodeName: 'animatingNode',
    attribute: 'x'
  })
  get x(): number {
    const {
      datum: { x, y },
      xScale,
      spread = 0,
      visualizerTypeIndex,
      visualizerTypeLength
    } = this;
    const middleOffset = this.getStyleProp('bar.data.width', x, y) / 2;
    const minOffset = (visualizerTypeLength - 1) / -2;
    const maxOffset = (visualizerTypeLength - 1) / 2;
    const barScale = scaleLinear().range([minOffset, maxOffset]);
    barScale.domain([0, visualizerTypeLength - 1]);
    const centerOffset = barScale(visualizerTypeIndex);
    const barWidth = this.getStyleProp('bar.data.width', x, y);
    return xScale(x) +
      (centerOffset * barWidth) + (centerOffset * spread) - middleOffset;
  }

  /**
   * The value of the `y` attribute on the `<rect>` element.
   */
  @hasAnimation({
    enter: (to, { container: { height } }) => interpolateNumber(height, to),
    transitory: interpolateNumber,
    exit: (from, { container: { height } }) => interpolateNumber(from, height),
    nodeName: 'animatingNode',
    attribute: 'y'
  })
  get y(): number {
    const { datum: { y }, yScale } = this;
    return yScale(y);
  }

  /**
   * The stroke for the bar.
   */
  get stroke(): number {
    const { datum } = this;
    return this.getStyleProp('bar.data.stroke', datum);
  }

  /**
   * The stroke width for the bar.
   */
  get strokeWidth(): number {
    const { datum } = this;
    return this.getStyleProp('bar.data.strokeWidth', datum);
  }

  get shouldAnimate(): boolean {
    const { datum, yScale, xScale } = this;
    return !!datum && !!yScale && !!xScale;
  }
}
