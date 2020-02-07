import { OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Constructor } from '../interfaces/common-types/constructor';
import { GroupDirective } from '../../directives/group/group.directive';

export function DataSubscribable<TBase extends Constructor>(Base: TBase) {
  abstract class Mixed extends Base
    implements OnInit, OnDestroy {
    abstract group: GroupDirective;
    abstract changeDetectorRef: ChangeDetectorRef;

    ngOnInit(): void {
      const { group } = this;
      group.registerDataSubscriberWithGroup(this);
    }

    ngOnDestroy(): void {
      const { group } = this;
      group.unregisterDataSubscriberWithGroup(this);
    }

    abstract onDataUpdate(): void;
    abstract afterDataUpdate(): void;
  }
  return Mixed as Constructor<Mixed>;
}
export type DataSubscriberComponent = InstanceType<ReturnType<typeof DataSubscribable>>;
