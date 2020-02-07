import { Component, Input, ViewChild, ElementRef, AfterViewInit, Optional,
  ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Alignment, RelativePosition, Coordinate } from '../../util/interfaces/common-types/positioning';
import { ChartComponent } from '../chart/chart.component';
import { LegendTheme } from '../../util/theme/legend';
import { ChartContainerComponent } from '../chart-container/chart-container.component';
import { BaseChartComponent } from '../../util/interfaces/class-interfaces/base-chart-component';
import { paddingAsObject } from '../../util/functions/padding-as-object';
import { ContentContainer } from '../../util/abstract-classes/content-container';
import { applyMixins } from '../../util/functions/mixins';
import { Stylable } from '../../util/mixins/stylable';
import { Positionable } from '../../util/mixins/positionable';

@Component({
  selector: 'g[i-ng-legend]',
  templateUrl: './legend.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LegendComponent
  extends applyMixins([Stylable, Positionable])
  implements AfterViewInit, BaseChartComponent {
  /**
   * Any styles to override.
   */
  @Input() style: LegendTheme['legend'];
  /**
   * The title of the legend
   */
  @Input() title: string;
  /**
   * Where to place the title of the legend relative to the swatches
   */
  @Input() titlePosition: RelativePosition = 'above';
  /**
   * The alignment of the title of the legend in its relative position.
   */
  @Input() titleAlignment: Alignment = 'end';
  /**
   * Any further offset of the title.
   */
  @Input() titleOffset: Coordinate;
  @ViewChild('legendContent') legendContentElement: ElementRef;
  @ViewChild('titleElement') titleElement: ElementRef;
  @ViewChild('legendSwatchesContent') legendSwatchesContentElement: ElementRef;

  container: ContentContainer;
  rootStylePath = 'legend.legend';
  holdForBackground = false;
  holdForTitle = false;

  constructor(
    public chart: ChartComponent,
    @Optional() chartContainer: ChartContainerComponent,
    private changeDetectorRef: ChangeDetectorRef) {
      super();
      this.container = chartContainer || chart;
  }

  ngAfterViewInit(): void { // Manually detecting changes to avoid ExpressionChangedAfterCheckedError
    if (this.title) {
      this.holdForTitle = true;
      this.changeDetectorRef.detectChanges();
    }
    this.holdForBackground = true;
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Get the translate function string for the legend title based on `titleAlignment`
   * and legend content.
   */
  get titleTransform(): string | null {
    const { legendSwatchesContentElement, titleElement } = this;
    if (!legendSwatchesContentElement || !titleElement) {
      return null;
    }
    const { titlePosition, titleAlignment } = this;
    const { nativeElement } = legendSwatchesContentElement;
    const { width, height } = nativeElement.getBBox();
    let x = 0;
    let y = 0;
    const fontSize = this.getStyleProp('legend.legend.title.fontSize');
    const padding = this.getStyleProp('legend.legend.title.padding');
    const fontNudge = fontSize * this.getStyleProp('global.fontNudgeRatio');
    if (titlePosition === 'above' || titlePosition === 'below') {
      x = titleAlignment === 'end' ? width :
        titleAlignment === 'middle' ? width / 2 :
        0;
    }
    if (titlePosition === 'right') {
      x = width + padding;
    }
    if (titlePosition === 'left') {
      x = -padding;
    }
    if (titlePosition === 'right' || titlePosition === 'left') {
      y = titleAlignment === 'end' ? height - (fontSize - fontNudge * 2) :
        titleAlignment === 'middle' ? (height - fontNudge) / 2 :
        fontSize - (fontNudge * 2);
    }
    if (titlePosition === 'below') {
      y = height + padding + (fontNudge / 2);
    }
    return `translate(${x}, ${y})`;
  }

  /**
   * Calculate the content translate string based on the legend title width
   * and height. This value is only used if the title is above the legend.
   */
  get contentTransform(): string | null {
    const { title, titleElement, titlePosition } = this;
    if (!title || !titleElement || titlePosition === 'below') {
      return null;
    }
    const fontSize = this.getStyleProp('legend.legend.title.fontSize');
    const padding = this.getStyleProp('legend.legend.title.padding');
    const fontNudge = fontSize * this.getStyleProp('global.fontNudgeRatio');
    let x;
    let y;
    if (titlePosition === 'above') {
      x = 0;
      y = padding + fontNudge;
      return `translate(${x}, ${y})`;
    }
  }

  /**
   * Determine the `[text-anchor]` attribute value of the `<text>` element.
   */
  get titleTextAnchor(): Alignment | null {
    const { titlePosition, titleAlignment } = this;
    if (titlePosition === 'above' || titlePosition === 'below') {
      return titleAlignment;
    }
    if (titlePosition === 'left') {
      return 'end';
    }
    return null;
  }

  /**
   * This translate function string moves the legend to the right a bit
   * when `titlePosition` is `'left'`. A weird bug occurs with trying to
   * position the legend according to the `Positionable` mixin without it.
   */
  get titleAlignmentAdjust(): string | null {
    const { title, titleElement, titlePosition } = this;
    if (!title || !titleElement || titlePosition !== 'left') {
      return null;
    }
    const { nativeElement } = titleElement;
    const { width } = nativeElement.getBBox();
    const padding = this.getStyleProp('legend.legend.title.padding');
    const x = width + padding;
    return `translate(${x}, 0)`;
  }

  /**
   * Calculates any further translate offset for the title based on `titleOffset`.
   */
  get titleFurtherOffset(): string | null {
    const { titleOffset } = this;
    if (!titleOffset) {
      return null;
    }
    const { x = 0, y = 0 } = titleOffset;
    return `translate(${x}, ${y})`;
  }

  /**
   * This method calculates the background `<rect>` width.
   */
  get backgroundWidth(): number | null {
    const { legendContentElement } = this;
    if (!legendContentElement) {
      return null;
    }
    const { nativeElement } = legendContentElement;
    const { width } = nativeElement.getBBox();
    const padding = this.getStyleProp('legend.legend.padding');
    const { left, right } = paddingAsObject(padding);
    return width + left + right;
  }

  /**
   * This method calculates the background `<rect>` height.
   */
  get backgroundHeight(): number | null {
    const { legendContentElement } = this;
    if (!legendContentElement) {
      return null;
    }
    const { nativeElement } = legendContentElement;
    const { height } = nativeElement.getBBox();
    const padding = this.getStyleProp('legend.legend.padding');
    const { top, bottom } = paddingAsObject(padding);
    return height + top + bottom;
  }

  /**
   * This adjust the position of the background `<rect>` slightly based on
   * background padding and the position of the legend according to the
   * `Positionable` mixin.
   */
  get backgroundPaddingAdjust(): string {
    const padding = this.getStyleProp('legend.legend.padding');
    const { top } = paddingAsObject(padding);
    const fontSize = this.getStyleProp('legend.legend.title.fontSize');
    const fontNudge = fontSize * this.getStyleProp('global.fontNudgeRatio');
    return `translate(0, ${top + fontNudge})`;
  }

  /**
   * This adjust the position of the legend content slightly based on
   * background padding and the position of the legend according to the
   * `Positionable` mixin.
   */
  get contentPaddingAdjust(): string {
    const padding = this.getStyleProp('legend.legend.padding');
    const fontSize = this.getStyleProp('legend.legend.title.fontSize');
    const fontNudge = fontSize * this.getStyleProp('global.fontNudgeRatio');
    const { top, left } = paddingAsObject(padding);
    return `translate(${left}, ${top * 2 + fontNudge})`;
  }

  /**
   * This adjust the position of the background `<rect>` slightly based on
   * whether a title is present, and the `fontNudge` specified in the chart theme.
   */
  get titleBackgroundAdjust(): string | null {
    const { title, titleElement, titlePosition } = this;
    if (!title || !titleElement) {
      return null;
    }
    const fontSize = this.getStyleProp('legend.legend.title.fontSize');
    const fontNudge = fontSize * this.getStyleProp('global.fontNudgeRatio');
    let y = 0;
    if (titlePosition === 'above') {
      y = (fontSize - fontNudge / 2) * -1;
      return `translate(0, ${y})`;
    }
    y = fontNudge * -1;
    return `translate(0, ${y})`;
  }
}
