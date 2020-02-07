export function padXScale(xScale, { left: paddingLeft, right: paddingRight }) {
  const [ beginning, end ] = xScale.domain();
  const paddedBeginning = beginning.valueOf() - Math.abs(xScale.invert(paddingLeft) - beginning);
  const paddedEnd = end.valueOf() + Math.abs(xScale.invert(paddingRight) - beginning);
  xScale.domain([paddedBeginning, paddedEnd]);
}

export function padYScale(yScale, { bottom: paddingBottom, top: paddingTop }) {
  const [ lowest ] = yScale.domain();
  const [ top, bottom ] = yScale.range();
  let paddedLowest = yScale.invert(top + paddingBottom);
  const paddedHighest = yScale.invert(bottom - paddingTop);
  if (lowest >= 0 && paddedLowest < 0) {
    paddedLowest = 0;
  }
  yScale.domain([paddedLowest, paddedHighest]);
}

export function padScales(xScale, yScale, padding) {
  padXScale(xScale, padding);
  padYScale(yScale, padding);
}
