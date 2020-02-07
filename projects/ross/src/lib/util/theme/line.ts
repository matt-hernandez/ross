import { colors } from './shared/colors';
import { LabelStyle, centeredLabelStyles } from './shared/labels';

export interface LineTheme {
  data: {
    stroke: string,
    strokeWidth: number
  };
  labels: LabelStyle;
}

export const line: LineTheme = {
  data: {
    stroke: colors.black,
    strokeWidth: 2
  },
  labels: centeredLabelStyles
};
