import { Injectable } from '@angular/core';
import { ChartContainerComponent } from '../components/chart-container/chart-container.component';
import { AxisComponent } from '../components/axis/axis.component';
import { GroupDirective } from '../directives/group/group.directive';
import { DataVisualizableComponent } from '../util/mixins/data-visualizable';
import { AxisElementsComponent } from '../components/axis-elements/axis-elements.component';

@Injectable()
export class ChartChildManagerService {
  private axes = new Set<AxisComponent>();
  private axesElements = new Set<AxisElementsComponent>();
  private containers = new Set<ChartContainerComponent>();
  private dataVisualizers = new Set<DataVisualizableComponent>();
  private groups = new Set<GroupDirective>();

  registerAxisElementsWithChart(axisElements: AxisElementsComponent): void {
    const { axesElements } = this;
    axesElements.add(axisElements);
  }

  unregisterAxisElementsWithChart(axisElements: AxisElementsComponent): void {
    const { axesElements } = this;
    axesElements.delete(axisElements);
  }

  getCorrespondingAxisForElements(axisElements: AxisElementsComponent): AxisComponent {
    const { axes } = this;
    const axesAsArray = Array.from(axes);
    return axesAsArray.find(axis => axis.name === axisElements.axisName);
  }

  registerAxisWithChart(axis: AxisComponent): void {
    const { axes } = this;
    axes.add(axis);
  }

  unregisterAxisWithChart(axis: AxisComponent): void {
    const { axes } = this;
    axes.delete(axis);
  }

  chartHasAxes(): boolean {
    const { axes } = this;
    return !!axes.size;
  }

  registerContainerWithChart(container: ChartContainerComponent): void {
    const { containers } = this;
    containers.add(container);
  }

  unregisterContainerWithChart(container: ChartContainerComponent): void {
    const { containers } = this;
    containers.delete(container);
  }

  chartHasContainer(): boolean {
    const { containers } = this;
    return !!containers.size;
  }

  registerDataVisualizerWithChart(dataVisualizer: DataVisualizableComponent): void {
    this.adjustDataVisualizersAndCharts('add', dataVisualizer);
  }

  unregisterDataVisualizerWithChart(dataVisualizer: DataVisualizableComponent): void {
    this.adjustDataVisualizersAndCharts('remove', dataVisualizer);
  }

  adjustDataVisualizersAndCharts(operation: 'add' | 'remove', dataVisualizer: DataVisualizableComponent): void {
    if (operation === 'add') {
      this.addDataVisualizerToChart(dataVisualizer);
    }
    if (operation === 'remove') {
      this.removeDataVisualizerFromChart(dataVisualizer);
    }
  }

  addDataVisualizerToChart(dataVisualizer: DataVisualizableComponent): void {
    const { dataVisualizers } = this;
    dataVisualizers.add(dataVisualizer);
  }

  removeDataVisualizerFromChart(dataVisualizer: DataVisualizableComponent): void {
    const { dataVisualizers } = this;
    dataVisualizers.delete(dataVisualizer);
  }

  registerGroupWithChart(group: GroupDirective): void {
    const { groups } = this;
    groups.add(group);
  }

  unregisterGroupWithChart(group: GroupDirective): void {
    const { groups } = this;
    groups.delete(group);
  }

  getChartGroups(): GroupDirective[] {
    const { groups } = this;
    if (!groups.size) {
      throw new Error('Chart has no group directives. Please use an iNgGroup directive either on ' +
        'the chart itself, or on a wrapping element inside the chart.');
    }
    return Array.from(groups);
  }
}
