import { Constructor } from '../interfaces/common-types/constructor';
import { OnInit } from '@angular/core';
import { DOMDependentDirective } from '../../directives/dom-dependent/dom-dependent.directive';

export function DOMDependendable<TBase extends Constructor>(Base: TBase) {
  abstract class Mixed extends Base
    implements OnInit {
    abstract domDependent: DOMDependentDirective;

    ngOnInit(): void {
      const { domDependent } = this;
      domDependent.componentName = this.constructor.name;
      domDependent.component = this;
    }
  }
  return Mixed as Constructor<Mixed>;
}
export type DOMDependentComponent = InstanceType<ReturnType<typeof DOMDependendable>>;
