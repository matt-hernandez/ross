import { ManualPosition } from '../interfaces/common-types/positioning';

export abstract class ContentContainer {
  abstract width: number;
  abstract height: number;

  get halfOfWidth(): number {
    return this.width / 2;
  }

  get halfOfHeight(): number {
    return this.height / 2;
  }

  get top(): number {
    return 0;
  }

  get right(): number {
    return this.width;
  }

  get bottom(): number {
    return this.height;
  }

  get left(): number {
    return 0;
  }

  /**
   * Get an object for the top left
   */
  get topLeft(): ManualPosition {
    const { top, left } = this;
    return {
      y: top,
      x: left
    };
  }

  /**
   * Get an object for the top center
   */
  get topCenter(): ManualPosition {
    const { top, halfOfWidth: centerX } = this;
    return {
      y: top,
      x: centerX
    };
  }

  /**
   * Get an object for the top right
   */
  get topRight(): ManualPosition {
    const { top, right } = this;
    return {
      y: top,
      x: right
    };
  }

  /**
   * Get an object for the center right
   */
  get centerRight(): ManualPosition {
    const { halfOfHeight: centerY, right } = this;
    return {
      y: centerY,
      x: right
    };
  }

  /**
   * Get an object for the bottom right
   */
  get bottomRight(): ManualPosition {
    const { bottom, right } = this;
    return {
      y: bottom,
      x: right
    };
  }

  /**
   * Get an object for the bottom center
   */
  get bottomCenter(): ManualPosition {
    const { bottom, halfOfWidth: centerX } = this;
    return {
      y: bottom,
      x: centerX
    };
  }

  /**
   * Get an object for the bottom left
   */
  get bottomLeft(): ManualPosition {
    const { bottom, left } = this;
    return {
      y: bottom,
      x: left
    };
  }

  /**
   * Get an object for the center left
   */
  get centerLeft(): ManualPosition {
    const { halfOfHeight: centerY, left } = this;
    return {
      y: centerY,
      x: left
    };
  }

  /**
   * Get the center X position. Currently, this is just
   * an alias for `halfOfWidth`
   */
  get centerX(): number {
    const { halfOfWidth } = this;
    return halfOfWidth;
  }

  /**
   * Get the center Y position. Currently, this is just
   * an alias for `halfOfHeight`
   */
  get centerY(): number {
    const { halfOfHeight } = this;
    return halfOfHeight;
  }

  /**
   * Get the center coordinates for the content area
   */
  get center(): ManualPosition {
    const { centerY, centerX } = this;
    return {
      x: centerX,
      y: centerY
    };
  }

  /**
   * Create the translate function string that will position the element in the top
   * left.
   */
  get topLeftTranslate(): string {
    const { topLeft: { x, y } } = this;
    return `translate(${x}, ${y})`;
  }

  /**
   * Create the translate function string that will position the element in the top
   * center.
   */
  get topCenterTranslate(): string {
    const { topCenter: { x, y } } = this;
    return `translate(${x}, ${y})`;
  }

  /**
   * Create the translate function string that will position the element in the top
   * right.
   */
  get topRightTranslate(): string {
    const { topRight: { x, y } } = this;
    return `translate(${x}, ${y})`;
  }

  /**
   * Create the translate function string that will position the element in the center
   * right.
   */
  get centerRightTranslate(): string {
    const { centerRight: { x, y } } = this;
    return `translate(${x}, ${y})`;
  }

  /**
   * Create the translate function string that will position the element in the bottom
   * right.
   */
  get bottomRightTranslate(): string {
    const { bottomRight: { x, y } } = this;
    return `translate(${x}, ${y})`;
  }

  /**
   * Create the translate function string that will position the element in the bottom
   * center.
   */
  get bottomCenterTranslate(): string {
    const { bottomCenter: { x, y } } = this;
    return `translate(${x}, ${y})`;
  }

  /**
   * Create the translate function string that will position the element in the bottom
   * left.
   */
  get bottomLeftTranslate(): string {
    const { bottomLeft: { x, y } } = this;
    return `translate(${x}, ${y})`;
  }

  /**
   * Create the translate function string that will position the element in the left
   * center.
   */
  get centerLeftTranslate(): string {
    const { centerLeft: { x, y } } = this;
    return `translate(${x}, ${y})`;
  }

  /**
   * Create the translate function string that will position the element in the
   * center.
   */
  get centerTranslate(): string {
    const { center: { x, y } } = this;
    return `translate(${x}, ${y})`;
  }
}
