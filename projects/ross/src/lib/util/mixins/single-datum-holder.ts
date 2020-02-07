import { Input } from '@angular/core';
import { Constructor } from '../interfaces/common-types/constructor';
import { Datum } from '../interfaces/common-types/data';

export function SingleDatumHolder<TBase extends Constructor>(Base: TBase) {
  abstract class Mixed extends Base {
    /**
     * The data to render.
     */
    @Input() datum: Datum;
  }
  return Mixed as Constructor<Mixed>;
}
export type SingleDatumComponent = InstanceType<ReturnType<typeof SingleDatumHolder>>;
