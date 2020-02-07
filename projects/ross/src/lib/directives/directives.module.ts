import { NgModule } from '@angular/core';

/* Directives Block Start */
import { GroupDirective } from './group/group.directive';
import { DOMDependentDirective } from './dom-dependent/dom-dependent.directive';
/* Directives Block End */

@NgModule({
  declarations: [
    /* Directives Declarations Block Start */
    GroupDirective,
    DOMDependentDirective,
    /* Directives Declarations Block End */
  ],
  exports: [
    /* Directives Exports Block Start */
    GroupDirective,
    DOMDependentDirective,
    /* Directives Exports Block End */
  ]
})
export class DirectivesModule { }
