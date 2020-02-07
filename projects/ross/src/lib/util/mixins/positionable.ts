import { Input, ViewChild, ElementRef } from '@angular/core';
import { ChartComponent } from '../../components/chart/chart.component';
import { Position, ManualPosition, Alignment } from '../interfaces/common-types/positioning';
import { hasPresetContentPosition, hasHorizontalContentInterestPoint,
  hasVerticalContentInterestPoint } from '../functions/has-premade-position';
import { Constructor } from '../interfaces/common-types/constructor';
import { ContentContainer } from '../abstract-classes/content-container';

export function Positionable<TBase extends Constructor>(Base: TBase) {
  abstract class Mixed extends Base {
    /**
     * A preset position, or an object with `x` and `y` properties.
     */
    @Input() position: Position;
    /**
     * A property to offset the position any further from the object passed to
     * `position`.
     */
    @Input() offset: ManualPosition;
    /**
     * The alignment for the container element horizontally after its contents have been
     * rendered.
     */
    @Input() horizontalAlignment: Alignment;
    /**
     * The alignment for the container element vertically after its contents have been
     * rendered.
     */
    @Input() verticalAlignment: Alignment;
    @ViewChild('container') containerElement: ElementRef;

    abstract container: ContentContainer;

    /**
     * Retrieve the translate function that will put the container in the proper position
     * specified by `position`.
     */
    get anchorPosition(): string {
      const { container, position } = this;
      if (!(container instanceof ChartComponent) && hasPresetContentPosition(position)) {
        throw new Error('Positionable component has a content specific position but is not nested ' +
          'directly inside a Chart component. Did you place your component inside a ChartContainer instead?');
      }
      if (typeof position === 'object') {
        const { x, y } = position;
        if (typeof x === 'number' && typeof y === 'number') {
          return `translate(${x}, ${y})`;
        }
        if (!(container instanceof ChartComponent)
          && (hasHorizontalContentInterestPoint(x) || hasVerticalContentInterestPoint(y))) {
          throw new Error('Positionable component has a content specific position but is not nested ' +
            'directly inside a Chart component. Did you place your component inside a ChartContainer instead?');
        }
        const normalizedX = typeof x === 'string' ?
          container[`${/center/i.test(x) ? `${x}X` : x}`] : x;
        const normalizedY = typeof y === 'string' ?
          container[`${/center/i.test(y) ? `${y}Y` : y}`] : y;
        return `translate(${normalizedX}, ${normalizedY})`;
      }
      const translatePropName = `${position}Translate`;
      return container[translatePropName] || null;
    }

    /**
     * Retrieve the translate function that will position the contents of the container in
     * the correct alignment relative to `position`.
     */
    get alignmentOffset(): string {
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

    /**
     * Retrieve the translate function that will provide any further offset to the container
     * if `offset` was specified.
     */
    get furtherOffset(): string {
      const { offset = {} } = this;
      const { x = 0, y = 0 } = offset;
      return `translate(${x}, ${y})`;
    }
  }
  return Mixed as Constructor<Mixed>;
}
export type PositionableComponent = InstanceType<ReturnType<typeof Positionable>>;
