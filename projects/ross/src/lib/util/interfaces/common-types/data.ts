export interface TemporalDatum {
  x: Date;
  y: number;
}

export interface LinearDatum {
  x: number;
  y: number;
}

export type IndependentAxisType = number | Date;

export type DependentAxisType = number;

export type Datum = TemporalDatum | LinearDatum;

export type TemporalData = TemporalDatum[];

export type LinearData = LinearDatum[];

export type DataType = 'Linear' | 'Temporal';

export type Data = Datum[];

export interface DatumWithOriginName {
  x: Date | number;
  y: number;
  from: string;
}

export interface DataWithOriginName {
  data: Data;
  from: string;
}

export type LinearDomain = [number, number];

export type TemporalDomain = [Date, Date];

export type Domain = LinearDomain | TemporalDomain;

export interface ShortHandDomain {
  x?: ['min' | Domain[0], 'max' | Domain[1]];
  y?: ['min' | LinearDomain[0], 'max' | LinearDomain[1]];
}

export interface UnifiedPoints {
  x?: Date | number;
  y?: number;
  values: DatumWithOriginName[];
}

export type AxisType = 'dependent' | 'independent';

export interface UnifiedDataDomain {
  dataType: DataType;
  xDomain: Domain;
  yDomain: LinearDomain;
  unifiedXPoints: UnifiedPoints[];
  unifiedYPoints: UnifiedPoints[];
}

export type AxisElementsType = 'bars' | 'grid' | 'crossSection';
