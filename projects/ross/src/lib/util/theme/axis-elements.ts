import { colors } from './shared/colors';

export interface AxisElementsTheme {
  bars: {
    oddNumberedFill: string;
    evenNumberedFill: string;
    stroke: string;
    strokeWidth: number;
  };
  grid: {
    stroke: string;
    strokeWidth: number;
    strokeDasharray: number;
  };
  crossSection: {
    stroke: string;
    strokeWidth: number;
    strokeDasharray: number;
  };
}

export const axisElements: AxisElementsTheme = {
  bars: {
    oddNumberedFill: 'transparent',
    evenNumberedFill: 'rgba(128, 128, 128, 0.1)',
    stroke: 'transparent',
    strokeWidth: 0
  },
  grid: {
    stroke: colors.colorScale[3],
    strokeWidth: 1,
    strokeDasharray: 5
  },
  crossSection: {
    stroke: colors.colorScale[3],
    strokeWidth: 1,
    strokeDasharray: 0
  }
};
