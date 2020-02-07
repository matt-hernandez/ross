import { AnimationConfig } from '../interfaces/common-types/animating';
import { AnimatableComponent } from '../mixins/animatable';

/**
 * This decorator registers an animation config for a specific property on a component.
 * @param config - The animation config for the property
 */
export function hasAnimation(config: AnimationConfig) {
  return (target: AnimatableComponent, name) => {
    if (!target.animationConfigs) {
      target.animationConfigs = new Map<string, AnimationConfig>();
    }
    target.animationConfigs.set(name, config);
  };
}
