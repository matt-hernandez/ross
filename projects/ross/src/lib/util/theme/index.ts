import { axis, AxisTheme } from './axis';
import { area, AreaTheme } from './area';
import { axisElements, AxisElementsTheme } from './axis-elements';
import { bar, BarTheme } from './bar';
import { global, GlobalTheme } from './global';
import { legend, LegendTheme } from './legend';
import { line, LineTheme } from './line';
import { scatter, ScatterTheme } from './scatter';
import { title } from './title';
import { LabelStyle } from './shared/labels';

export interface Theme {
  axis: AxisTheme;
  area: AreaTheme;
  axisElements: AxisElementsTheme;
  bar: BarTheme;
  global: GlobalTheme;
  legend: LegendTheme;
  line: LineTheme;
  scatter: ScatterTheme;
  title: LabelStyle;
}

export const theme: Theme = {
  area,
  axis,
  axisElements,
  bar,
  global,
  legend,
  line,
  scatter,
  title
};
