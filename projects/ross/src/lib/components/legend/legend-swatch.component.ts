import { Component, ElementRef, Input, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit,
  ChangeDetectionStrategy } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { LegendTheme } from '../../util/theme/legend';
import { LegendSwatchService } from '../../services/legend-swatch.service';
import { LegendSwatchSectionComponent } from './legend-swatch-section.component';
import { paddingAsObject } from '../../util/functions/padding-as-object';
import { applyMixins } from '../../util/functions/mixins';
import { Stylable } from '../../util/mixins/stylable';

@Component({
  selector: 'g[i-ng-legend-swatch]',
  templateUrl: './legend-swatch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LegendSwatchComponent
  extends applyMixins([Stylable])
  implements OnInit, AfterViewInit {
  /**
   * Any styles to override
   */
  @Input() style: LegendTheme['swatch'];
  /**
   * The label for the swatch.
   */
  @Input() label: string;
  @ViewChild('container') container: ElementRef;
  @ViewChild('content') contentElement: ElementRef;
  @ViewChild('background') backgroundElement: ElementRef;
  @ViewChild('symbolContainer') symbolContainer: ElementRef;

  rootStylePath = 'legend.swatch';
  holdForBackground = false;

  constructor(public chart: ChartComponent,
    private legendSwatchSection: LegendSwatchSectionComponent,
    private legendSwatchService: LegendSwatchService,
    private changeDetectorRef: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    const { legendSwatchService, legendSwatchSection } = this;
    legendSwatchService.registerSwatchWithSection(legendSwatchSection, this);
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
    const padding = this.getStyleProp('legend.swatch.padding');
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
    const padding = this.getStyleProp('legend.swatch.padding');
    const { top, bottom } = paddingAsObject(padding);
    return height + top + bottom;
  }

  /**
   * This adjust the position of the background `<rect>` slightly based on
   * background padding and the position of the legend according to the
   * `Positionable` mixin.
   */
  get backgroundPaddingAdjust(): string {
    const padding = this.getStyleProp('legend.swatch.padding');
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
    const padding = this.getStyleProp('legend.swatch.padding');
    const { top, left } = paddingAsObject(padding);
    return `translate(${left}, ${top})`;
  }

  /**
   * Get the section position relative to its neighbors.
   */
  get containerPosition(): string {
    const { container, legendSwatchSection, legendSwatchService } = this;
    if (!container) {
      return null;
    }
    const { x, y } = legendSwatchService.getSwatchPosition(legendSwatchSection, this);
    return `translate(${x}, ${y})`;
  }

  /**
   * The the position for the swatch label.
   */
  get labelAlignment(): string | null {
    const { symbolContainer } = this;
    if (!symbolContainer) {
      return null;
    }
    const { nativeElement } = symbolContainer;
    const { width, height } = nativeElement.getBBox();
    const fontSize = this.getStyleProp('legend.swatch.label.fontSize');
    const padding = this.getStyleProp('legend.swatch.label.padding');
    const fontNudge = fontSize * this.getStyleProp('global.fontNudgeRatio');
    const x = width + padding;
    const y = height / 2 + fontSize / 2 - (fontNudge / 2);
    return `translate(${x}, ${y})`;
  }
}
