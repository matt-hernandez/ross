export interface ManualPadding {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface Coordinate {
  x?: number;
  y?: number;
}

export type BidirectionalPadding = [number, number];

export type Padding = number | BidirectionalPadding | ManualPadding;

export type HorizontalInterestPoint = 'left' | 'center' | 'right';

export type VerticalInterestPoint = 'top' | 'center' | 'bottom';

export type HorizontalContentInterestPoint = 'contentLeft' | 'contentCenter' | 'contentRight';

export type VerticalContentInterestPoint = 'contentTop' | 'contentCenter' | 'contentBottom';

export interface ManualPosition {
  x?: number | HorizontalInterestPoint | HorizontalContentInterestPoint;
  y?: number | VerticalInterestPoint | VerticalContentInterestPoint;
}

export type PresetPosition = 'topLeft' | 'topCenter' | 'topRight' | 'centerRight' | 'bottomRight' |
  'bottomCenter' | 'bottomLeft' | 'centerLeft' | 'center';

export type PresetContentPosition = 'contentTopLeft' | 'contentTopCenter' | 'contentTopRight' |
  'contentCenterRight' | 'contentBottomRight' | 'contentBottomCenter' | 'contentBottomLeft' |
  'contentCenterLeft' | 'contentCenter';

export type Position = PresetPosition | PresetContentPosition | ManualPosition;

export type AxisSide = 'top' | 'right' | 'bottom' | 'left';

export type Alignment = 'start' | 'middle' | 'end';

export type AxisBarAlignment = 'start' | 'middle';

export type Layout = 'column' | 'inline';

export type RelativePosition = 'above' | 'right' | 'below' | 'left';
