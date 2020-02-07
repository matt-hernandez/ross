import { ScaleLinear, ScaleTime } from 'd3-scale';

export type VisualizerType = 'Bar' | 'Line' | 'Area' | 'Scatter';

export type XScale = ScaleLinear<number, number> | ScaleTime<number, number>;

export type YScale = ScaleLinear<number, number>;

export interface ScalePair {
  xScale: XScale;
  yScale: YScale;
}
