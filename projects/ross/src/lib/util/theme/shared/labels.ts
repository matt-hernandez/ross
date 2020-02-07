import { fontSize, letterSpacing, fontFamily } from './typography';
import { colors } from './colors';

export interface LabelStyle {
  fontFamily: string;
  fontSize: number;
  letterSpacing: number | string;
  padding: number;
  fill: string;
  stroke: string;
  textAnchor?: string;
}

export const baseLabelStyles: LabelStyle = {
  fontFamily: fontFamily,
  fontSize,
  letterSpacing,
  padding: 10,
  fill: colors.black,
  stroke: 'transparent'
};
export const centeredLabelStyles: LabelStyle = {
  ...baseLabelStyles,
  textAnchor: 'middle'
};
