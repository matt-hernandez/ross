import { Component, Input, OnInit, ElementRef, ViewChild, ChangeDetectorRef, AfterViewInit,
  ChangeDetectionStrategy } from '@angular/core';
import { Layout } from '../../util/interfaces/common-types/positioning';
import { ChartComponent } from '../chart/chart.component';
import { LegendComponent } from './legend.component';
import { LegendSwatchService } from '../../services/legend-swatch.service';
import { LegendTheme } from '../../util/theme/legend';
import { paddingAsObject } from '../../util/functions/padding-as-object';
import { Stylable } from '../../util/mixins/stylable';
import { applyMixins } from '../../util/functions/mixins';

@Component({
  selector: 'g[i-ng-legend-swatch-grid]',
  templateUrl: './legend-swatch-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LegendSwatchGridComponent
  extends applyMixins([Stylable])
  implements OnInit, AfterViewInit {
  /**
   * Any styles to override.
   */
  @Input() style: LegendTheme['grid'];
  /**
   * The layout for the grid.
   */
  @Input() layout: Layout = 'column';
  @ViewChild('content') contentElement: ElementRef;
  @ViewChild('background') backgroundElement: ElementRef;

  rootStylePath = 'legend.grid';
  holdForBackground = false;

  constructor(public chart: ChartComponent,
    private legend: LegendComponent,
    private legendSwatchService: LegendSwatchService,
    private changeDetectorRef: ChangeDetectorRef) {
    super();
  }

  ngAfterViewInit(): void { // Manually detecting changes to avoid ExpressionChangedAfterCheckedError
    this.holdForBackground = true;
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit(): void {
    const { legendSwatchService, legend } = this;
    legendSwatchService.registerGridWithLegend(legend, this);
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
    const padding = this.getStyleProp('legend.grid.padding');
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
    const padding = this.getStyleProp('legend.grid.padding');
    const { top, bottom } = paddingAsObject(padding);
    return height + top + bottom;
  }

  /**
   * This adjust the position of the background `<rect>` slightly based on
   * background padding and the position of the legend according to the
   * `Positionable` mixin.
   */
  get backgroundPaddingAdjust(): string {
    const padding = this.getStyleProp('legend.grid.padding');
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
    const padding = this.getStyleProp('legend.grid.padding');
    const { top, left } = paddingAsObject(padding);
    return `translate(${left}, ${top})`;
  }
}
