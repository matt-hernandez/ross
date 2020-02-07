import { Injectable } from '@angular/core';
import { add, compose, lensPath, lensProp, map, slice, transduce, view } from 'ramda';
import { LegendComponent } from '../components/legend/legend.component';
import { LegendSwatchComponent } from '../components/legend/legend-swatch.component';
import { LegendSwatchSectionComponent } from '../components/legend/legend-swatch-section.component';
import { LegendSwatchGridComponent } from '../components/legend/legend-swatch-grid.component';
import { Coordinate } from '../util/interfaces/common-types/positioning';

const getBoundingBox = compose(
  map(view(lensPath(['container', 'nativeElement']))),
  map(el => el.getBBox())
);

const elementHorizontalCalc = compose(
  getBoundingBox,
  map(view(lensProp('width')))
);

const elementVerticalCalc = compose(
  getBoundingBox,
  map(view(lensProp('height')))
);

@Injectable()
export class LegendSwatchService {
  private legendAndGrids = new Map<LegendComponent, LegendSwatchGridComponent[]>();
  private gridAndSections = new Map<LegendSwatchGridComponent, LegendSwatchSectionComponent[]>();
  private sectionAndSwatches = new Map<LegendSwatchSectionComponent, LegendSwatchComponent[]>();

  registerSwatchWithSection(section: LegendSwatchSectionComponent, swatch: LegendSwatchComponent): void {
    const { sectionAndSwatches } = this;
    const swatches = sectionAndSwatches.get(section);
    if (!swatches) {
      sectionAndSwatches.set(section, [swatch]);
      return;
    }
    sectionAndSwatches.set(section, [ ...swatches, swatch ]);
  }

  unregisterSwatchWithSection(section: LegendSwatchSectionComponent, swatch: LegendSwatchComponent): void {
    const { sectionAndSwatches } = this;
    const swatches = sectionAndSwatches.get(section) || [];
    const index = swatches.indexOf(swatch);
    if (swatches.length === 0 || (index !== -1 && swatches.length === 1)) {
      sectionAndSwatches.delete(section);
      return;
    }
    if (index !== -1) {
      sectionAndSwatches.set(section, [ ...swatches.slice(0, index), ...swatches.slice(index + 1) ]);
    }
  }

  registerSectionWithGrid(grid: LegendSwatchGridComponent, section: LegendSwatchSectionComponent): void {
    const { gridAndSections } = this;
    const sections = gridAndSections.get(grid);
    if (!sections) {
      gridAndSections.set(grid, [section]);
      return;
    }
    gridAndSections.set(grid, [ ...sections, section ]);
  }

  unregisterSectionWithGrid(grid: LegendSwatchGridComponent, section: LegendSwatchSectionComponent): void {
    const { gridAndSections } = this;
    const sections = gridAndSections.get(grid) || [];
    const index = sections.indexOf(section);
    if (sections.length === 0 || (index !== -1 && sections.length === 1)) {
      gridAndSections.delete(grid);
      return;
    }
    if (index !== -1) {
      gridAndSections.set(grid, [ ...sections.slice(0, index), ...sections.slice(index + 1) ]);
    }
  }

  registerGridWithLegend(legend: LegendComponent, grid: LegendSwatchGridComponent): void {
    const { legendAndGrids } = this;
    const grids = legendAndGrids.get(legend);
    if (!grids) {
      legendAndGrids.set(legend, [grid]);
      return;
    }
    legendAndGrids.set(legend, [ ...grids, grid ]);
  }

  unregisterGridWithLegend(legend: LegendComponent, grid: LegendSwatchGridComponent): void {
    const { legendAndGrids } = this;
    const grids = legendAndGrids.get(legend) || [];
    const index = grids.indexOf(grid);
    if (grids.length === 0 || (index !== -1 && grids.length === 1)) {
      legendAndGrids.delete(legend);
      return;
    }
    if (index !== -1) {
      legendAndGrids.set(legend, [ ...grids.slice(0, index), ...grids.slice(index + 1) ]);
    }
  }

  getSwatchPosition(section: LegendSwatchSectionComponent, swatch: LegendSwatchComponent): Coordinate {
    const { sectionAndSwatches } = this;
    const swatches = sectionAndSwatches.get(section) || [];
    const index = swatches.indexOf(swatch);
    if (index === -1) {
      throw new Error('Tried to get position for a legend swatch that cannot be found with ' +
        'the corresponding section.');
    }
    const previousSwatches = slice(0, index, swatches);
    if (previousSwatches.length === 0) {
      return {
        x: 0,
        y: 0
      };
    }
    const x = section.layout === 'column' ? 0 :
      transduce(elementHorizontalCalc, add, 0, previousSwatches);
    const y = section.layout === 'inline' ? 0 :
      transduce(elementVerticalCalc, add, 0, previousSwatches);
    return {
      x,
      y
    };
  }

  getSectionPosition(grid: LegendSwatchGridComponent, section: LegendSwatchSectionComponent): Coordinate {
    const { gridAndSections } = this;
    const sections = gridAndSections.get(grid) || [];
    const index = sections.indexOf(section);
    if (index === -1) {
      throw new Error('Tried to get position for a legend swatch section that cannot be found with ' +
        'the corresponding grid.');
    }
    const previousSections = slice(0, index, sections);
    if (previousSections.length === 0) {
      return {
        x: 0,
        y: 0
      };
    }
    const x = grid.layout === 'column' ? 0 :
      transduce(elementHorizontalCalc, add, 0, previousSections);
    const y = grid.layout === 'inline' ? 0 :
      transduce(elementVerticalCalc, add, 0, previousSections);
    return {
      x,
      y
    };
  }

  getGridPosition(legend: LegendComponent, grid: LegendSwatchGridComponent): Coordinate {
    const { legendAndGrids } = this;
    const grids = legendAndGrids.get(legend) || [];
    const index = grids.indexOf(grid);
    if (index === -1) {
      throw new Error('Tried to get position for a legend grid that cannot be found with ' +
        'the corresponding legend.');
    }
    const previousGrids = slice(0, index, grids);
    if (previousGrids.length === 0) {
      return {
        x: 0,
        y: 0
      };
    }
    const padding = grid.getStyleProp('legend.grid.padding');
    const x = transduce(elementHorizontalCalc, add, 0, previousGrids);
    return x + padding * previousGrids.length;
  }
}
