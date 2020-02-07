import { ContentContainerPadded } from '../../util/abstract-classes/content-container-padded';

export class ChartStub extends ContentContainerPadded {
  width = 450;
  height = 300;
  padding = 10;

  constructor() {
    super();
  }
}
