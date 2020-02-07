import { Component, OnInit, OnDestroy, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { ContentContainer } from '../../util/abstract-classes/content-container';
import { ChartChildManagerService } from '../../services/chart-child-manager.service';

/**
 * This element is used to contain elements that must adhere to the chart padding.
 * It must be contained inside a {@link ChartComponent}.
 */
@Component({
  selector: 'g[i-ng-chart-container]',
  templateUrl: './chart-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartContainerComponent extends ContentContainer implements OnInit, OnDestroy {
  width: number;
  height: number;
  @HostBinding('attr.transform') transform;

  constructor(private chart: ChartComponent, private chartChildManagerService: ChartChildManagerService) {
    super();
  }

  ngOnInit() {
    const { chart, chartChildManagerService } = this;
    this.width = chart.contentWidth;
    this.height = chart.contentHeight;
    this.transform = chart.contentTopLeftTranslate;
    chartChildManagerService.registerContainerWithChart(this);
  }

  ngOnDestroy() {
    this.chartChildManagerService.unregisterContainerWithChart(this);
  }
}
