import { baseLabelStyles, LabelStyle } from './shared/labels';
import { colors } from './shared/colors';
import { BorderContainer } from './shared/interfaces';

export interface Swatch extends BorderContainer {
  symbol: {
    fill: string;
    width: number;
    height: number;
  };
  label: LabelStyle;
}

export interface LegendContainer extends BorderContainer {
  title: LabelStyle;
}

export interface LegendTheme {
  swatch: Swatch;
  legend: LegendContainer;
  grid: BorderContainer;
  section: BorderContainer;
}

export const legend: LegendTheme = {
  swatch: {
    padding: [5, 0],
    borderRadius: 0,
    backgroundFill: 'transparent',
    strokeWidth: 0,
    stroke: colors.black,
    symbol: {
      fill: colors.black,
      width: 10,
      height: 10
    },
    label: {
      ...baseLabelStyles
    }
  },
  legend: {
    title: {
      ...baseLabelStyles,
      fontSize: 16,
      padding: 5
    },
    backgroundFill: 'transparent',
    borderRadius: 0,
    stroke: colors.black,
    strokeWidth: 1,
    padding: 10
  },
  grid: {
    padding: 0,
    strokeWidth: 0,
    stroke: colors.black,
    backgroundFill: 'transparent',
    borderRadius: 0
  },
  section: {
    padding: [0, 5],
    strokeWidth: 0,
    stroke: colors.black,
    backgroundFill: 'transparent',
    borderRadius: 0
  }
};
