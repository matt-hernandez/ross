import { Component, ElementRef, Input, Optional, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { ChartContainerComponent } from '../chart-container/chart-container.component';
import { BaseChartComponent } from '../../util/interfaces/class-interfaces/base-chart-component';
import { ContentContainer } from '../../util/abstract-classes/content-container';
import { Alignment } from '../../util/interfaces/common-types/positioning';
import { applyMixins } from '../../util/functions/mixins';
import { Positionable } from '../../util/mixins/positionable';

@Component({
  selector: 'g[i-ng-positionable-container]',
  templateUrl: './positionable-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PositionableContainerComponent
  extends applyMixins([Positionable])
  implements BaseChartComponent {
  /**
   * A string to indicate how to align the content of this component horizontally relative to its
   * `position` input.
   */
  @Input() horizontalAlignment: Alignment;
  /**
   * A string to indicate how to align the content of this component vertically relative to its
   * `position` input.
   */
  @Input() verticalAlignment: Alignment;
  @ViewChild('container') containerElement: ElementRef;

  container: ContentContainer;

  constructor(public chart: ChartComponent, @Optional() chartContainer: ChartContainerComponent) {
    super();
    this.container = chartContainer || chart;
  }

  /**
   * Calculate the transform to the get the content of the component to match up with the
   * values of `horizontalAlignment` and `verticalAlignment`.
   */
  get alignmentOffset(): string | null {
    const { containerElement } = this;
    if (!containerElement) {
      return null;
    }
    const { nativeElement } = containerElement;
    const { horizontalAlignment, verticalAlignment } = this;
    const { width, height } = nativeElement.getBBox();
    const x = horizontalAlignment === 'end' ? -width :
      horizontalAlignment === 'middle' ? -width / 2 :
      0;
    const y = verticalAlignment === 'end' ? -height :
      verticalAlignment === 'middle' ? -height / 2 :
      0;
    return `translate(${x}, ${y})`;
  }
}
