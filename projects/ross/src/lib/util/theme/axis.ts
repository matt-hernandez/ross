import { colors } from './shared/colors';
import { baseLabelStyles, centeredLabelStyles, LabelStyle } from './shared/labels';

export interface AxisLabel extends LabelStyle {
  padding: number;
}

export interface AxisTheme {
  axis?: {
    fill: string,
    stroke: string,
    strokeWidth: number,
    strokeLinecap: string,
    strokeLinejoin: string
    label: AxisLabel;
  };
  grid?: {
    fill: string,
    stroke: string,
    pointerEvents: string
  };
  ticks?: {
    size: number,
    strokeWidth: number,
    stroke: string
    labels: AxisLabel;
  };
}

export const axis: AxisTheme = {
  axis: {
    fill: 'transparent',
    stroke: colors.black,
    strokeWidth: 1,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    label: {
      ...centeredLabelStyles,
      padding: 30
    },
  },
  grid: {
    fill: 'none',
    stroke: 'none',
    pointerEvents: 'visible'
  },
  ticks: {
    size: 6,
    strokeWidth: 1,
    stroke: colors.black,
    labels: {
      ...baseLabelStyles,
      padding: 4
    }
  },
};
