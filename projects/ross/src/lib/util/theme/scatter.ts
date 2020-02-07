import { colors } from './shared/colors';
import { LabelStyle, baseLabelStyles } from './shared/labels';

export interface ScatterTheme {
  data: {
    fill: string;
    radius: number;
    stroke: string;
    strokeWidth: number;
  };
  labels: LabelStyle;
}

export const scatter: ScatterTheme = {
  data: {
    fill: 'transparent',
    radius: 10,
    stroke: colors.black,
    strokeWidth: 2
  },
  labels: baseLabelStyles
};
