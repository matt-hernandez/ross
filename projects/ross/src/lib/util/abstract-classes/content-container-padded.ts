import { Padding, ManualPosition, ManualPadding } from '../interfaces/common-types/positioning';
import { ContentContainer } from './content-container';
import { paddingAsObject } from '../functions/padding-as-object';

export abstract class ContentContainerPadded extends ContentContainer {
  abstract padding: Padding;

  get paddingAsObject(): ManualPadding {
    const { padding } = this;
    return paddingAsObject(padding);
  }

  /**
   * Get the amount of width reserved for the chart area.
   */
  get contentWidth(): number {
    const { paddingAsObject: { left, right }, width } = this;
    return width - right - left;
  }

  /**
   * Get the amount of height reserved for the chart area.
   */
  get contentHeight(): number {
    const { paddingAsObject: { top, bottom }, height } = this;
    return height - top - bottom;
  }

  get halfOfContentWidth(): number {
    return this.contentWidth / 2;
  }

  get halfOfContentHeight(): number {
    return this.contentHeight / 2;
  }

  get contentTop(): number {
    const { paddingAsObject: { top } } = this;
    return top;
  }

  get contentRight(): number {
    const { paddingAsObject: { right }, width } = this;
    return width - right;
  }

  get contentBottom(): number {
    const { paddingAsObject: { bottom }, height } = this;
    return height - bottom;
  }

  get contentLeft(): number {
    const { paddingAsObject: { left } } = this;
    return left;
  }

  get contentCenterX(): number {
    const { contentLeft, halfOfContentWidth } = this;
    return contentLeft + halfOfContentWidth;
  }

  get contentCenterY(): number {
    const { contentTop, halfOfContentHeight } = this;
    return contentTop + halfOfContentHeight;
  }

  /**
   * Get an object for the top left of the content area
   */
  get contentTopLeft(): ManualPosition {
    const { contentTop: top, contentLeft: left } = this;
    return {
      y: top,
      x: left
    };
  }

  /**
   * Get an object for the top center of the content area
   */
  get contentTopCenter(): ManualPosition {
    const { contentTop: top, contentCenterX: centerX } = this;
    return {
      y: top,
      x: centerX
    };
  }

  /**
   * Get an object for the top right of the content area
   */
  get contentTopRight(): ManualPosition {
    const { contentTop: top, contentRight: right } = this;
    return {
      y: top,
      x: right
    };
  }

  /**
   * Get an object for the center right of the content area
   */
  get contentCenterRight(): ManualPosition {
    const { contentCenterY: centerY, contentRight: right } = this;
    return {
      y: centerY,
      x: right
    };
  }

  /**
   * Get an object for the bottom right of the content area
   */
  get contentBottomRight(): ManualPosition {
    const { contentBottom: bottom, contentRight: right } = this;
    return {
      y: bottom,
      x: right
    };
  }

  /**
   * Get an object for the bottom center of the content area
   */
  get contentBottomCenter(): ManualPosition {
    const { contentBottom: bottom, contentCenterX: centerX } = this;
    return {
      y: bottom,
      x: centerX
    };
  }

  /**
   * Get an object for the bottom left of the content area
   */
  get contentBottomLeft(): ManualPosition {
    const { contentBottom: bottom, contentLeft: left } = this;
    return {
      y: bottom,
      x: left
    };
  }

  /**
   * Get an object for the center left of the content area
   */
  get contentCenterLeft(): ManualPosition {
    const { contentCenterY: centerY, contentLeft: left } = this;
    return {
      y: centerY,
      x: left
    };
  }

  /**
   * Get the center coordinates for the content area
   */
  get contentCenter(): ManualPosition {
    const { contentCenterY, contentCenterX } = this;
    return {
      y: contentCenterY,
      x: contentCenterX
    };
  }

  /**
   * Create the translate function string that will position the element in the top
   * left of the content area.
   */
  get contentTopLeftTranslate(): string {
    const { contentTopLeft: { x, y } } = this;
    return `translate(${x}, ${y})`;
  }

  /**
   * Create the translate function string that will position the element in the top
   * center of the content area.
   */
  get contentTopCenterTranslate(): string {
    const { contentTopCenter: { x, y } } = this;
    return `translate(${x}, ${y})`;
  }

  /**
   * Create the translate function string that will position the element in the top
   * right of the content area.
   */
  get contentTopRightTranslate(): string {
    const { contentTopRight: { x, y } } = this;
    return `translate(${x}, ${y})`;
  }

  /**
   * Create the translate function string that will position the element in the center
   * right of the content area.
   */
  get contentCenterRightTranslate(): string {
    const { contentCenterRight: { x, y } } = this;
    return `translate(${x}, ${y})`;
  }

  /**
   * Create the translate function string that will position the element in the bottom
   * right of the content area.
   */
  get contentBottomRightTranslate(): string {
    const { contentBottomRight: { x, y } } = this;
    return `translate(${x}, ${y})`;
  }

  /**
   * Create the translate function string that will position the element in the bottom
   * center of the content area.
   */
  get contentBottomCenterTranslate(): string {
    const { contentBottomCenter: { x, y } } = this;
    return `translate(${x}, ${y})`;
  }

  /**
   * Create the translate function string that will position the element in the bottom
   * left of the content area.
   */
  get contentBottomLeftTranslate(): string {
    const { contentBottomLeft: { x, y } } = this;
    return `translate(${x}, ${y})`;
  }

  /**
   * Create the translate function string that will position the element in the left
   * center of the content area.
   */
  get contentCenterLeftTranslate(): string {
    const { contentCenterLeft: { x, y } } = this;
    return `translate(${x}, ${y})`;
  }

  /**
   * Create the translate function string that will position the element in the
   * center of the content area.
   */
  get contentCenterTranslate(): string {
    const { contentCenter: { x, y } } = this;
    return `translate(${x}, ${y})`;
  }
}
