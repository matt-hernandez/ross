import { Input, ChangeDetectorRef, Renderer2, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import * as easeModule from 'd3-ease';
import { Constructor } from '../interfaces/common-types/constructor';
import { AnimateSettings, Interpolator, AnimationConfig, AnimationEaseFunctionResolver,
  AnimationEase } from '../interfaces/common-types/animating';
import { GroupDirective } from '../../directives/group/group.directive';
import { resolveFunctionOrStaticValue } from '../functions/resolve-function-or-static-value';

const animationEaseFns = ['back', 'backIn', 'backOut', 'backInOut', 'bounce', 'bounceIn',
  'bounceOut', 'bounceInOut', 'circle', 'circleIn', 'circleOut', 'circleInOut', 'linear',
  'linearIn', 'linearOut', 'linearInOut', 'cubic', 'cubicIn', 'cubicOut', 'cubicInOut',
  'elastic', 'elasticIn', 'elasticOut', 'elasticInOut', 'exp', 'expIn', 'expOut',
  'expInOut', 'poly', 'polyIn', 'polyOut', 'polyInOut', 'quad', 'quadIn', 'quadOut',
  'quadInOut', 'sin', 'sinIn', 'sinOut', 'sinInOut'];

const animationEaseFnsResolver: AnimationEaseFunctionResolver =
  animationEaseFns.reduce((acc, easeFnName: AnimationEase) => {
    const keyOfEaseModule = `ease${easeFnName[0].toUpperCase()}${easeFnName.slice(1)}`;
    acc[easeFnName] = easeModule[keyOfEaseModule];
    return acc;
  }, {} as any);

export function Animatable<TBase extends Constructor>(Base: TBase) {
  abstract class Mixed extends Base
    implements OnChanges, OnDestroy {
    /**
     * An object with animation settings. If no object is present in this field,
     * then no animation will run. The only required property in this object is
     * `duration`. All other props have their own defaults if not specified.
     */
    @Input() animate: AnimateSettings;

    firstDraw = true;
    exiting = false;

    private changeDetectionCycleId: number;
    private fromValues = new Map<string, number | string>();
    private previouslyRecordedToValues = new Map<string, number | string>();
    private runningAnimationsAndInterpolators = new Map<number, Map<string, Interpolator>>();

    animationConfigs: Map<string, AnimationConfig>; // KEEP THIS UNDEFINED

    abstract group: GroupDirective;
    abstract renderer: Renderer2;
    abstract changeDetectorRef: ChangeDetectorRef;
    /**
     * A getter that does a final check on the component to make sure it should animate. This is
     * mainly used to make sure that scales or other drawing functions are defined before an
     * animation is triggered.
     */
    abstract get shouldAnimate(): boolean;

    ngOnChanges(changes: SimpleChanges): void {
      if (changes['style'] && !changes['style'].firstChange) {
        this.startAnimation();
      }
    }

    /**
     * Run the exit animation.
     * @param callback - The callback to call once the exit animation is over, or to run
     * immediately if there are no animation settings.
     */
    ngOnDestroy(): void {
      const { hasAnimateSettings } = this;
      if (hasAnimateSettings) {
        this.exiting = true;
        this.checkForAnimation();
        return;
      }
    }

    /**
     * This method checks to see whether or not an animation should occur. If it should, it calls
     * `startAnimation()`
     */
    checkForAnimation(): void {
      const { allConditionsReadyToAnimate } = this;
      if (allConditionsReadyToAnimate) {
        this.startAnimation();
      }
    }

    /**
     * This function starts the animation by calculating interpolators only for the parts of a component
     * that need to change and then triggering an animation cycle for all those parts as a whole. If
     * a second animation starts and it involves changing a part of a component that is being animated
     * from a previous animation, the second animation will remove that part from the previous. This prevents
     * animations from clashing with each other.
     */
    startAnimation(): void {
      const getterNamesAndInterpolators = this.calculateInterpolators();
      if (getterNamesAndInterpolators.size === 0) { // If nothing needs to change, don't run animation.
        return;
      }
      const { firstDraw, fromValues, animationConfigs,
        runningAnimationsAndInterpolators } = this;
      if (firstDraw) {
        this.firstDraw = false;
      }
      let animationProgress = 0;
      let animationTimeline = 0;
      let animationStartTime = new Date();
      let animationID;
      const { animateSettings, easeFn } = this;
      const { duration } = animateSettings;
      getterNamesAndInterpolators.forEach((unused, getterName) => {
        // Remove any properties that will be animated from previous animations
        runningAnimationsAndInterpolators.forEach((interpolators) => {
          interpolators.delete(getterName);
        });
      });
      const animationFrameCallback = () => {
        const endTime = new Date();
        animationTimeline += endTime.valueOf() - animationStartTime.valueOf();
        animationProgress = animationTimeline / duration;
        animationStartTime = endTime;
        if (animationProgress > 1) {
          animationProgress = 1;
        }
        const easedTime = easeFn(animationProgress);
        getterNamesAndInterpolators.forEach((interpolator, getterName) => {
          const config = animationConfigs.get(getterName);
          const newValue = resolveFunctionOrStaticValue(interpolator, easedTime);
          fromValues.set(getterName, newValue);
          const { nodeName, attribute } = config;
          if (newValue === null) {
            this.renderer.removeAttribute(this[nodeName].nativeElement, attribute);
            return;
          }
          this.renderer.setAttribute(this[nodeName].nativeElement, attribute, newValue);
        });
        if (animationProgress === 1) {
          runningAnimationsAndInterpolators.delete(animationID);
          return;
        }
        animationID = requestAnimationFrame(animationFrameCallback);
        runningAnimationsAndInterpolators.set(animationID, getterNamesAndInterpolators);
      };
      animationFrameCallback();
    }

    /**
     * Calculate interpolators only for the portions of the component that need to change, or for
     * animations that need to animate to a new final value. Everything else is ignored.
     */
    calculateInterpolators(): Map<string, Interpolator> {
      const getterNamesAndInterpolators = new Map<string, Interpolator>();
      const { fromValues, previouslyRecordedToValues, firstDraw, exiting } = this;
      this.animationConfigs.forEach((config, getterName) => {
        let interpolator;
        const to = this[getterName];
        const previouslyRecordedTo = previouslyRecordedToValues.get(getterName);
        const from = fromValues.get(getterName);
        if (firstDraw) {
          interpolator = resolveFunctionOrStaticValue(config.enter, to, this);
        } else if (exiting) {
          interpolator = resolveFunctionOrStaticValue(config.exit, from, this);
        } else {
          if (to === from || previouslyRecordedTo === to) {
            return;
          }
          interpolator = resolveFunctionOrStaticValue(config.transitory, from, to, this);
        }
        interpolator = interpolator || to; // Final check for undefined
        previouslyRecordedToValues.set(getterName, to);
        getterNamesAndInterpolators.set(getterName, interpolator);
      });
      return getterNamesAndInterpolators;
    }

    /**
     * This is the function that actually runs the change detection cycle and determines whether
     * it has reached its duration.
     */
    runningChangeDetectionCycle = (callback) => {
      let animationProgress = 0;
      let animationTimeline = 0;
      let animationStartTime = new Date();
      const frameFunction = () => {
        const { animateSettings, easeFn, changeDetectorRef } = this;
        const { duration } = animateSettings;
        const endTime = new Date();
        animationTimeline += endTime.valueOf() - animationStartTime.valueOf();
        animationProgress = animationTimeline / duration;
        animationStartTime = endTime;
        if (animationProgress > 1) {
          animationProgress = 1;
        }
        const easedTime = easeFn(animationProgress);
        callback(easedTime);
        changeDetectorRef.detectChanges();
        if (animationProgress === 1) {
          return;
        }
        this.changeDetectionCycleId = requestAnimationFrame(frameFunction);
      };
      frameFunction();
    }

    /**
     * Start a change detection cycle based on the current animation settings.
     * @param callback - The function to call on every animation frame before calling change
     * detection.
     */
    kickOffChangeDetectionCycle(callback: (progress: number) => void): void {
      const { allConditionsReadyToAnimate, runningChangeDetectionCycle } = this;
      if (allConditionsReadyToAnimate) {
        cancelAnimationFrame(this.changeDetectionCycleId);
        runningChangeDetectionCycle(callback);
      }
    }

    /**
     * This getter consolidates all the boolean flags the check to see whether an animation
     * should occur.
     */
    get allConditionsReadyToAnimate(): boolean {
      const { hasAnimateSettings, shouldAnimate } = this;
      return hasAnimateSettings && shouldAnimate;
    }

    /**
     * A boolean flag to indicate whether there are animate settings either on the component
     * or in the group.
     */
    get hasAnimateSettings(): boolean {
      const { group } = this;
      const { animate = group.animate } = this;
      return !!animate;
    }

    get animateSettings(): AnimateSettings {
      const { group } = this;
      const { animate = group.animate } = this;
      return animate;
    }

    get easeFn(): Function {
      const { animateSettings } = this;
      const { ease = 'quad' } = animateSettings;
      return animationEaseFnsResolver[ease];
    }

    get exitTime(): string {
      const { hasAnimateSettings } = this;
      if (hasAnimateSettings) {
        const { animateSettings: { duration } } = this;
        return `${duration + 20}ms`;
      }
      return '0';
    }
  }
  return Mixed as Constructor<Mixed>;
}
export type AnimatableComponent = InstanceType<ReturnType<typeof Animatable>>;
