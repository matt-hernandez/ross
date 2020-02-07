import { Directive, Input, OnInit, OnDestroy, Optional } from '@angular/core';
import { uniq, map } from 'ramda';
import { scaleLinear, scaleTime } from 'd3-scale';
import { getMergedNumericDomain, resolveDataType, dataAccessor } from '../../util/functions/data';
import { ChartComponent } from '../../components/chart/chart.component';
import { ChartChildManagerService } from '../../services/chart-child-manager.service';
import { Padding } from '../../util/interfaces/common-types/positioning';
import { paddingAsObject } from '../../util/functions/padding-as-object';
import { UnifiedDataDomain, Domain, ShortHandDomain, LinearDomain, Data } from '../../util/interfaces/common-types/data';
import { ScalePair, XScale, YScale } from '../../util/interfaces/common-types/drawing';
import { padScales } from '../../util/functions/scale';
import { ChartContainerComponent } from '../../components/chart-container/chart-container.component';
import { BaseChartComponent } from '../../util/interfaces/class-interfaces/base-chart-component';
import { ContentContainer } from '../../util/abstract-classes/content-container';
import { DataVisualizableComponent } from '../../util/mixins/data-visualizable';
import { AnimateSettings } from '../../util/interfaces/common-types/animating';
import { DataSubscriberComponent } from '../../util/mixins/data-subscribable';

/**
 * Use this attribute directive when you want to group visualizations and unify their
 * x and y data together.
 *
 * Unification will only work if the `x` values are of the same type (i.e. all numbers, Dates, or
 * strings) and if the visualization is compatible with this directive. Some visualizations, like Pies
 * are not.
 *
 * If multiple visualizations are not contained in an `[iNgGroup]` directive, they will calculate
 * their own scales to draw themselves.
 *
 * It's best to use this directive on a `<g>` element, or a `<ng-container>` directive.
 *
 * @example
 * <i-ng-chart [padding]="50">
 *              <svg:g i-ng-chart-container>
 *                <ng-container iNgGroup>
 *                  <g i-ng-line
 *                    [data]="[{ x: 'Jan', y: 1 }, { x: 'Feb', y: 3 }, { x: 'Mar', y: 3 }, { x: 'Apr', y: 5 },
 *                      { x: 'May', y: 4 }, { x: 'Jun', y: 6 }]"
 *                  ></g>
 *                  <g i-ng-line
 *                    [data]="[{ x: 'Feb', y: 2 }, { x: 'Mar', y: 3 }, { x: 'Apr', y: 5 }, { x: 'May', y: 7 },
 *                      { x: 'Jun', y: 6 }, { x: 'July', y: 9 }]"
 *                  ></g>
 *                </ng-container>
 *              </svg:g>
 * </i-ng-chart>
 */
@Directive({
  selector: '[iNgGroup]'
})
export class GroupDirective implements OnInit, OnDestroy, BaseChartComponent {
  /**
   * This value will be used to separate bar charts that are inside this group.
   */
  @Input() spread: number;
  /**
   * This value can be used to set the bounds of the x and y values used to draw the chart. It
   * defaults to a box drawn from the lowest `x` value to the highest `x` value,
   * and from `0` to the highest `y` value.
   */
  @Input() domain: ShortHandDomain = {
    x: ['min', 'max'],
    y: [0, 'max']
  };
  /**
   * How much to pad values inside the chart. It follows the same API as normal padding. One thing
   * to note, padding will not make either x or y values dip below `0` unless an actual value in
   * the data goes below `0` first.
   */
  @Input() domainPadding: Padding;
  /**
   * Animation settings to provide to all visualizations inside this group directive.
   */
  @Input() animate: AnimateSettings;

  xScale: XScale;
  yScale: YScale;
  container: ContentContainer;

  private dataCollection: Map<DataVisualizableComponent, Data> = new Map<DataVisualizableComponent, Data>();
  private dataSubscribers: DataSubscriberComponent[] = [];
  private _unifiedDomain: UnifiedDataDomain;
  private updateSubscribersId;
  private batchUpdateInProgress = false;

  constructor(
    public chart: ChartComponent,
    @Optional() public chartContainer: ChartContainerComponent,
    private chartChildManagerService: ChartChildManagerService) {
    this.container = chartContainer || chart;
  }

  /**
   * Update a data subscriber component.
   * @param dataSubscriber
   */
  static updateSubscriber(dataSubscriber: DataSubscriberComponent): void {
    dataSubscriber.onDataUpdate();
    try {
      dataSubscriber.changeDetectorRef.detectChanges();
    } catch (e) {} // Add try-catch for subscribers that are removed as a result of data update
    dataSubscriber.afterDataUpdate();
  }

  ngOnInit(): void {
    this.chartChildManagerService.registerGroupWithChart(this);
  }

  ngOnDestroy(): void {
    this.chartChildManagerService.unregisterGroupWithChart(this);
  }

  /**
   * A boolean that indicates whether this group directive has any data in it.
   */
  get hasData(): boolean {
    const { dataCollection } = this;
    return !!dataCollection.size;
  }

  /**
   * Get the unified domain for all the data inside the group.
   */
  get unifiedDomain(): UnifiedDataDomain {
    const { resolvedUnifiedDomain } = this;
    return resolvedUnifiedDomain;
  }

  /**
   * This method resolves the unified domain and the value of `domain`.
   */
  get resolvedUnifiedDomain(): UnifiedDataDomain {
    const { _unifiedDomain, domain } = this;
    if (!domain) {
      return _unifiedDomain;
    }
    const { xDomain: [ beginning, end ], yDomain: [ lowest, highest ] } = _unifiedDomain;
    const { x, y } = domain;
    // Type assert the next two variables because of TypeScript does not infer consistent types
    // when removing values out of tuples.
    const xDomain = (x ? [x[0] === 'min' ? beginning : x[0], x[1] === 'max' ? end : x[1]] :
      _unifiedDomain.xDomain) as Domain;
    const yDomain = (y ? [y[0] === 'min' ? lowest : y[0], y[1] === 'max' ? highest : y[1]] :
      [0, _unifiedDomain.yDomain[1]]) as LinearDomain;
    return {
      ..._unifiedDomain,
      xDomain,
      yDomain
    };
  }

  /**
   * Return the pair of scales that will be responsible for drawing data on the chart given the
   * group and all its data.
   */
  get scaleData(): ScalePair {
    const { xScale, yScale } = this;
    return {
      xScale,
      yScale
    };
  }

  /**
   * Register a data visualizer and its data with the group.
   * @param data - The data array.
   * @param dataVisualizer - The data visualizer.
   */
  registerDataWithGroup(data: Data, dataVisualizer: DataVisualizableComponent): void {
    const operation = 'add';
    this.adjustDataCollection(operation, data, dataVisualizer);
  }

  /**
   * Remove a data visualizer and its data from the group.
   * @param data - The data array.
   * @param dataVisualizer - The data visualizer.
   */
  unregisterDataWithGroup(dataVisualizer: DataVisualizableComponent): void {
    const operation = 'remove';
    this.adjustDataCollection(operation, null, dataVisualizer);
  }

  /**
   * This function determines whether to add or remove a data visualizer from the group
   * and then unifies if necessary. It will also schedule a batch update to all data subscribers
   * on the group in a `setTimeout`. The reason for using `setTimeout` is to throttle the number
   * of updates to data subscribers in case data across multiple visualizations has changed at
   * the same time.
   * @param operation - Whether to add or remove.
   * @param data - The data array.
   * @param dataVisualizer - The data visualizer.
   */
  adjustDataCollection(operation: 'add' | 'remove', data: Data, dataVisualizer: DataVisualizableComponent): void {
    const { dataCollection } = this;
    if (operation === 'add') {
      dataCollection.set(dataVisualizer, data);
    } else if (operation === 'remove') {
      dataCollection.delete(dataVisualizer);
    }
    clearTimeout(this.updateSubscribersId);
    if (dataCollection.size > 0) {
      this.unify();
      this.generateScales();
      this.batchUpdateInProgress = true;
      this.updateSubscribersId = setTimeout(() => {
        this.batchUpdateInProgress = false; // DO NOT MOVE THIS
        const { dataSubscribers } = this;
        dataCollection.forEach((value, key) => key._dataRender = key.data);
        dataSubscribers.forEach(GroupDirective.updateSubscriber);
      }, 0);
    }
  }

  /**
   * Based on the chart dimensions and all the data inside the group, generate the x and y scales
   * that will be responsible for drawing all visualizations inside the chart.
   */
  generateScales(): void {
    const { xDomain: [ beginning, end ], yDomain: [ lowest, highest ], dataType } = this.unifiedDomain;
    const { container: { top, right, bottom, left }, domainPadding } = this;
    const domainPaddingObject = paddingAsObject(domainPadding);
    const xScale = dataType === 'Temporal' ? scaleTime() : scaleLinear();
    xScale.range([left, right]);
    xScale.domain([beginning, end]);
    const yScale = scaleLinear();
    yScale.range([bottom, top]);
    yScale.domain([lowest, highest]);
    padScales(xScale, yScale, domainPaddingObject);
    this.xScale = xScale;
    this.yScale = yScale;
  }

  /**
   * Unify the data.
   */
  unify(): void {
    const { dataCollection } = this;
    const data = Array.from(dataCollection.entries()).map(([key, value]) => {
      return {
        data: value,
        from: key.name
      };
    });
    const isUnified = uniq(map(resolveDataType, dataAccessor(data))).length <= 1;
    if (!isUnified) {
      throw new Error('Group directive contains two or more data visualizations that are not of ' +
        'the same `x` data type. Did you mix number `x` values with `Date` `x` values?');
    }
    this._unifiedDomain = getMergedNumericDomain(data);
  }

  /**
   * Register a data subscriber with the group.
   * @param dataSubscriber - The data subscriber.
   */
  registerDataSubscriberWithGroup(dataSubscriber: DataSubscriberComponent): void {
    this.adjustDataSubscriberCollection('add', dataSubscriber);
  }

  /**
   * Remove a data subscriber from the group.
   * @param dataSubscriber - The data subscriber.
   */
  unregisterDataSubscriberWithGroup(dataSubscriber: DataSubscriberComponent): void {
    this.adjustDataSubscriberCollection('remove', dataSubscriber);
  }

  /**
   * This function determines whether to add or remove a data subscriber from the group.
   * It will also immediately update the data subscriber if the group has data and if a batch
   * update is not currently scheduled.
   * @param operation - Whether to add or remove.
   * @param dataSubscriber - The data visualizer.
   */
  adjustDataSubscriberCollection(operation: 'add' | 'remove', dataSubscriber: DataSubscriberComponent): void {
    const { dataSubscribers } = this;
    if (operation === 'add') {
      this.dataSubscribers = [ ...dataSubscribers, dataSubscriber ];
      const { hasData, batchUpdateInProgress } = this;
      if (hasData && !batchUpdateInProgress) {
        GroupDirective.updateSubscriber(dataSubscriber);
      }
    } else if (operation === 'remove') {
      const index = dataSubscribers.indexOf(dataSubscriber);
      this.dataSubscribers = [ ...dataSubscribers.slice(0, index), ...dataSubscribers.slice(index + 1) ];
    }
  }
}
