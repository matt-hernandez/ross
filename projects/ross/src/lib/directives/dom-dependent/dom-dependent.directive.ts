import { Directive } from '@angular/core';

const selectors = [
  'g[i-ng-area]',
  'g[i-ng-bar]',
];

@Directive({
  selector: selectors.join(', ')
})
export class DOMDependentDirective {
  componentName: string;
  component;
}
