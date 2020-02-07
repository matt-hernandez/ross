import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, ChangeDetectorRef,
  ChangeDetectionStrategy } from '@angular/core';
import { Layout } from '../../util/interfaces/common-types/positioning';
import { ChartComponent } from '../chart/chart.component';
import { LegendSwatchService } from '../../services/legend-swatch.service';
import { LegendTheme } from '../../util/theme/legend';
import { LegendSwatchGridComponent } from './legend-swatch-grid.component';
import { paddingAsObject } from '../../util/functions/padding-as-object';
import { Stylable } from '../../util/mixins/stylable';
import { applyMixins } from '../../util/functions/mixins';

@Component({
  selector: 'g[i-ng-legend-swatch-section]',
  templateUrl: './legend-swatch-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LegendSwatchSectionComponent
  extends applyMixins([Stylable])
  implements OnInit, AfterViewInit {
  /**
   * Any styles to override.
   */
  @Input() style: LegendTheme['section'];
  /**
   * The layout for the grid.
   */
  @Input() layout: Layout = 'column';
  @ViewChild('container') container: ElementRef;
  @ViewChild('content') contentElement: ElementRef;
  @ViewChild('background') backgroundElement: ElementRef;

  holdForBackground = false;
  rootStylePath = 'legend.section';

  constructor(public chart: ChartComponent,
    private legendGrid: LegendSwatchGridComponent,
    private legendSwatchService: LegendSwatchService,
    private changeDetectorRef: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    const { legendSwatchService, legendGrid } = this;
    legendSwatchService.registerSectionWithGrid(legendGrid, this);
  }

  ngAfterViewInit(): void { // Manually detecting changes to avoid ExpressionChangedAfterCheckedError
    this.holdForBackground = true;
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Adjust the background box when it falls out of line with the swatch content.
   */
  get swatchBackgroundAdjust(): string {
    const { contentElement, backgroundElement } = this;
    const { nativeElement: contentNativeElement } = contentElement;
    const { nativeElement: backgroundNativeElement } = backgroundElement;
    const { y: contentY } = contentNativeElement.getBBox();
    const { y: backgroundY } = backgroundNativeElement.getBBox();
    return `translate(0, ${contentY - backgroundY})`;
  }

  /**
   * Calculate the width of the rectangle.
   */
  get backgroundWidth(): number {
    const { contentElement } = this;
    const { nativeElement } = contentElement;
    const { width } = nativeElement.getBBox();
    const padding = this.getStyleProp('legend.section.padding');
    const { left, right } = paddingAsObject(padding);
    return width + left + right;
  }

  /**
   * Calculate the height of the rectangle.
   */
  get backgroundHeight(): number {
    const { contentElement } = this;
    const { nativeElement } = contentElement;
    const { height } = nativeElement.getBBox();
    const padding = this.getStyleProp('legend.section.padding');
    const { top, bottom } = paddingAsObject(padding);
    return height + top + bottom;
  }

  /**
   * This adjust the position of the background `<rect>` slightly based on
   * background padding and the position of the legend according to the
   * `Positionable` mixin.
   */
  get backgroundPaddingAdjust(): string {
    const padding = this.getStyleProp('legend.section.padding');
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
    const padding = this.getStyleProp('legend.section.padding');
    const { top, left } = paddingAsObject(padding);
    return `translate(${left}, ${top})`;
  }

  /**
   * Get the section position relative to its neighbors.
   */
  get containerPosition(): string {
    const { container, legendGrid, legendSwatchService } = this;
    if (!container) {
      return null;
    }
    const { x, y } = legendSwatchService.getSectionPosition(legendGrid, this);
    return `translate(${x}, ${y})`;
  }
}
