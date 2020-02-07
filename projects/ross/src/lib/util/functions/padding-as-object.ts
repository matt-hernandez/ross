import { ManualPadding } from '../interfaces/common-types/positioning';

export function paddingAsObject(padding): ManualPadding {
  if (!padding) {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
  }
  if (typeof padding === 'number') {
    return {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding
    };
  }
  if (Array.isArray(padding)) {
    const [ vertical, horizontal ] = padding;
    return {
      top: vertical,
      right: horizontal,
      bottom: vertical,
      left: horizontal
    };
  }
  const { top = 0, right = 0, bottom = 0, left = 0 } = padding;
  return {
    top,
    right,
    bottom,
    left
  };
}
