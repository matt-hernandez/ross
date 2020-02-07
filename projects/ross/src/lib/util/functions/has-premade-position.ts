import { PresetContentPosition, PresetPosition, HorizontalContentInterestPoint,
  VerticalContentInterestPoint } from '../interfaces/common-types/positioning';

const horizontalContentInterestPoints: Array<HorizontalContentInterestPoint> = [
  'contentRight', 'contentCenter', 'contentLeft'
];

const verticalContentInterestPoints: Array<VerticalContentInterestPoint> = [
  'contentTop', 'contentCenter', 'contentBottom'
];

const presetPosition: Array<PresetPosition> = [
  'topLeft', 'topCenter', 'topRight', 'centerRight', 'bottomRight',
  'bottomCenter', 'bottomLeft', 'centerLeft', 'center'
];

const presetContentPositions: Array<PresetContentPosition> = [
  'contentTopLeft', 'contentTopCenter', 'contentTopRight',
  'contentCenterRight', 'contentBottomRight', 'contentBottomCenter', 'contentBottomLeft',
  'contentCenterLeft', 'contentCenter'
];

export function hasHorizontalContentInterestPoint(position): boolean {
  return horizontalContentInterestPoints.includes(position);
}

export function hasVerticalContentInterestPoint(position): boolean {
  return verticalContentInterestPoints.includes(position);
}

export function hasPresetPosition(position): boolean {
  return presetPosition.includes(position);
}

export function hasPresetContentPosition(position): boolean {
  return presetContentPositions.includes(position);
}
