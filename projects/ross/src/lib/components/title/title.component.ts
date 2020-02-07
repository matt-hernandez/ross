import { Component, Input, Optional, ChangeDetectionStrategy } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { ChartContainerComponent } from '../chart-container/chart-container.component';
import { hasPresetContentPosition, hasPresetPosition } from '../../util/functions/has-premade-position';
import { BaseChartComponent } from '../../util/interfaces/class-interfaces/base-chart-component';
import { ContentContainer } from '../../util/abstract-classes/content-container';
import { Alignment } from '../../util/interfaces/common-types/positioning';
import { LabelStyle } from '../../util/theme/shared/labels';
import { applyMixins } from '../../util/functions/mixins';
import { Stylable } from '../../util/mixins/stylable';
import { Positionable } from '../../util/mixins/positionable';

@Component({
  selector: 'g[i-ng-title]',
  templateUrl: './title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleComponent
  extends applyMixins([Stylable, Positionable])
  implements BaseChartComponent {
    /**
     * Any styles to override.
     */
  @Input() style: LabelStyle;
  /**
   * The text for the title.
   */
  @Input() text: string;
  /**
   * By default, we assume that if you specify a preset position using any "Bottom" coordinates,
   * you want the top of your text to align with that bottom coordinate. We will apply
   * the transformations necessary to make that happen. However, if that isn't the case, specify
   * `false` for this value, and those transforms will be omitted.
   */
  @Input() renderBottomInside = true;
  /**
   * A text alignment property.
   */
  @Input() textAlign: Alignment;

  rootStylePath = 'title';
  container: ContentContainer;

  constructor(public chart: ChartComponent, @Optional() chartContainer: ChartContainerComponent) {
    super();
    this.container = chartContainer || chart;
  }

  /**
   * Gets the amount of vertical separation between the title and the chart area. This is only
   * used if a preset position using any of the "Top" or "Bottom" coordinates is specified.
   */
  get yPadding(): number | null {
    const { position } = this;
    const fontSize = this.getStyleProp('title.fontSize');
    const padding = this.getStyleProp('title.padding');
    const fontNudge = fontSize * this.getStyleProp('global.fontNudgeRatio');
    if (hasPresetPosition(position) || hasPresetContentPosition(position)) {
      if (`${position}`.includes('top') || `${position}`.includes('Top')) {
        return padding * -1;
      }
      if (`${position}`.includes('bottom') || `${position}`.includes('Bottom')) {
        return padding + fontSize - fontNudge;
      }
    }
    return null;
  }
}
