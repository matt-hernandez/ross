import { OnInit, AfterContentInit, OnChanges, AfterViewInit, OnDestroy,
  AfterContentChecked, AfterViewChecked, SimpleChanges, DoCheck } from '@angular/core';
import { Constructor } from '../interfaces/common-types/constructor';

const lifeCycleMethods = ['ngOnChanges', 'ngOnInit', 'ngDoCheck', 'ngAfterContentInit', 'ngAfterContentChecked',
  'ngAfterViewInit', 'ngAfterViewChecked', 'ngOnDestroy'];

export class MixinSeed implements OnChanges, OnInit, DoCheck, AfterContentInit, AfterContentChecked,
  AfterViewInit, AfterViewChecked, OnDestroy {
  ngOnChanges(changes: SimpleChanges): void {}
  ngOnInit(): void {}
  ngDoCheck(): void {}
  ngAfterContentInit(): void {}
  ngAfterContentChecked(): void {}
  ngAfterViewInit(): void {}
  ngAfterViewChecked(): void {}
  ngOnDestroy(): void {}
}

/* tslint:disable */
/**
 * 
 * THERE IS SOME STRAIGHT UP TYPESCRIPT WITCHCRAFT HAPPENING IN THS CHUNK OF CODE. I'M NOT EVEN SURE
 * OF WHAT'S HAPPENING ALL THE WAY. JUST MAKING THIS COMMENT SO OTHERS CAN SEE IN CASE THEY NEED
 * TO MODIFY SOMETHING BETWEEN THESE TSLINT COMMENTS.
 * 
 */
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

type MergeConstructorTypes<T extends Array<(arg) => Constructor<any>>> =
  UnionToIntersection<InstanceType<ReturnType<T[number]>>>;

export function applyMixins<T extends Array<(arg) => Constructor<any>>>(mixins: T): Constructor<MergeConstructorTypes<T> & MixinSeed> {
  const MixedClass = mixins.reduce((acc, mixin) => mixin(acc), MixinSeed);
  mergeLifeCycleMethods(MixedClass);
  return MixedClass;
}
/* tslint:enable */

export function mergeLifeCycleMethods<T>(Base: Constructor): void {
  lifeCycleMethods.forEach(methodName => {
    let proto = Base.prototype;
    const methods = [];
    do {
      const lifeCycleDescriptor = Object.getOwnPropertyDescriptor(proto, methodName);
      if (lifeCycleDescriptor) {
        methods.push(lifeCycleDescriptor);
      }
    } while (proto = Object.getPrototypeOf(proto));
    Base.prototype[methodName] = function(...args) {
      methods.forEach(method => method.value.apply(this, args));
    };
  });
}
