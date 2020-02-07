import { compose, filter, find, flatten, lensProp, map, sort, uniq, view } from 'ramda';
import { extent } from 'd3-array';
import { Data, UnifiedDataDomain, DataType, LinearDatum, TemporalDatum, DataWithOriginName } from '../interfaces/common-types/data';

export const attributeAccessor = compose(view, lensProp);

export const mapGet = compose(map, attributeAccessor);

export const xAccessor = attributeAccessor('x');

export const xMapAccessor = map(xAccessor);

export const xFilter = (value) => filter(d => d.x === value);

export const filterMap = (predicate, mapper) => compose(map(mapper), filter(predicate));

export const uniqueXMapAccessor = compose(uniq, xMapAccessor);

export const yAccessor = attributeAccessor('y');

export const yMapAccessor = map(yAccessor);

export const yFilter = (value) => filter(d => d.y === value);

export const uniqueYMapAccessor = compose(uniq, yMapAccessor);

export const dataAccessor = mapGet('data');

export const dataIsValid = data => data && Array.isArray(data) && data.length;

export const dataNotValid = data => !data || !Array.isArray(data) || !data.length;

export const defaultSort = sort((a, b) => a - b);

export const dataOwnsDatum = (datum) => (data) => data.includes(datum);

export const retrieveDatumOwner = (datum, dataArrays) => find(dataOwnsDatum(datum))(dataArrays);

export const dataWithOriginOwnsData = (data) => (dataWithOrigin) => dataWithOrigin.data === data;

export const retrieveDataOwner = (data, dataWithOrigin) => find(dataWithOriginOwnsData(data))(dataWithOrigin);

export const resolveDataType = (data: Data): DataType => {
  const firstDatum: LinearDatum | TemporalDatum = data[0];
  const xDomainType = typeof firstDatum.x;
  switch (xDomainType) {
    case 'number': {
      return 'Linear';
    }
    case 'object': {
      return 'Temporal';
    }
  }
};

export function getMergedNumericDomain(dataWithOrigin: DataWithOriginName[]): UnifiedDataDomain {
  if (dataWithOrigin.length === 0) {
    return {
      dataType: 'Linear',
      xDomain: [0, 1],
      yDomain: [0, 1],
      unifiedXPoints: [],
      unifiedYPoints: []
    };
  }
  const dataArrays = dataAccessor(dataWithOrigin);
  const dataType = resolveDataType(dataArrays[0]);
  const allDataObjects = flatten(dataArrays);
  const yDomain = extent(yMapAccessor(allDataObjects));
  const xValues = uniqueXMapAccessor(allDataObjects);
  const yValues = uniqueYMapAccessor(allDataObjects);
  const xDomain = extent(xValues);
  const unifiedXPoints = map(xValue =>
    ({
      x: xValue,
      values: map(datum =>
        ({
          ...datum,
          from: retrieveDataOwner(retrieveDatumOwner(datum, dataArrays), dataWithOrigin).from
        }), xFilter(xValue)(allDataObjects))
    }), xValues);
  const unifiedYPoints = map(yValue =>
    ({
      y: yValue,
      values: map(datum =>
        ({
          ...datum,
          from: retrieveDataOwner(retrieveDatumOwner(datum, dataArrays), dataWithOrigin).from
        }), yFilter(yValue)(allDataObjects))
    }), yValues);
  return {
    dataType,
    xDomain,
    yDomain,
    unifiedXPoints,
    unifiedYPoints
  };
}
