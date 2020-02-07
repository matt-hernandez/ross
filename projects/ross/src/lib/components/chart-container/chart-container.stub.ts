import { ContentContainer } from '../../util/abstract-classes/content-container';
import { ChartStub } from '../chart/chart.stub';

export class ChartContainerStub extends ContentContainer {
  width: number;
  height: number;
  chart: ChartStub;

  constructor() {
    super();
    this.chart = new ChartStub;
    this.width = this.chart.contentWidth;
    this.height = this.chart.contentHeight;
  }
}
