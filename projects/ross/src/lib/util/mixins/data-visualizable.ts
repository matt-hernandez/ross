import { Input, OnDestroy, SimpleChanges, OnChanges, OnInit } from '@angular/core';
import { Constructor } from '../interfaces/common-types/constructor';
import { GroupDirective } from '../../directives/group/group.directive';
import { Data } from '../interfaces/common-types/data';
import { VisualizerType } from '../interfaces/common-types/drawing';
import { dataIsValid } from '../functions/data';
import { ChartChildManagerService } from '../../services/chart-child-manager.service';

export function DataVisualizable<TBase extends Constructor>(Base: TBase) {
  abstract class Mixed extends Base
    implements OnChanges, OnInit, OnDestroy {
    /**
     * The data to render.
     */
    @Input() data: Data;

    /**
     * This prop represents the data that will actually be drawn in the UI.
     */
    _dataRender: Data;

    abstract name: string;
    readonly abstract id: number;
    abstract chartChildManagerService: ChartChildManagerService;
    abstract group: GroupDirective;
    abstract visualizerType: VisualizerType;

    /**
     * This Angular lifecycle method checks to see if data is being passed to this component that
     * is valid. If so, it registers the visualizer with the chart if that hasn't already been
     * done, and then updates the data in the group.
     * @param changes - SimpleChanges
     */
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['data']) {
        const { group } = this;
        const data = changes['data'].currentValue;
        const isDataValid = dataIsValid(data);
        if (!isDataValid) {
          console.warn(`An invalid 'data' value of ${data} was passed to visualization ${this.constructor.name}. ` +
            `Avoid passing values like 'null', 'undefined', or empty arrays to visualizations. Instead, remove them ` +
            `from the UI using '*ngIf'.`);
          return;
        }
        group.registerDataWithGroup(data, this);
      }
    }

    ngOnInit(): void {
      const { chartChildManagerService } = this;
      chartChildManagerService.registerDataVisualizerWithChart(this);
    }

    ngOnDestroy(): void {
      const { group, chartChildManagerService } = this;
      group.unregisterDataWithGroup(this);
      chartChildManagerService.unregisterDataVisualizerWithChart(this);
    }
  }
  return Mixed as Constructor<Mixed>;
}
export type DataVisualizableComponent = InstanceType<ReturnType<typeof DataVisualizable>>;
