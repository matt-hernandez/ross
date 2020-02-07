import { colors } from './shared/colors';

export interface BarTheme {
  data: {
    fill: string;
    width: number;
    stroke: string;
    strokeWidth: number;
  };
}

export const bar: BarTheme = {
  data: {
    fill: colors.black,
    width: 20,
    stroke: 'transparent',
    strokeWidth: 0
  }
};
