export type AnimationEase = 'back' | 'backIn' | 'backOut' | 'backInOut' | 'bounce' | 'bounceIn' |
  'bounceOut' | 'bounceInOut' | 'circle' | 'circleIn' | 'circleOut' | 'circleInOut' | 'linear' |
  'linearIn' | 'linearOut' | 'linearInOut' | 'cubic' | 'cubicIn' | 'cubicOut' | 'cubicInOut' |
  'elastic' | 'elasticIn' | 'elasticOut' | 'elasticInOut' | 'exp' | 'expIn' | 'expOut' |
  'expInOut' | 'poly' | 'polyIn' | 'polyOut' | 'polyInOut' | 'quad' | 'quadIn' | 'quadOut' |
  'quadInOut' | 'sin' | 'sinIn' | 'sinOut' | 'sinInOut';

export type AnimationEaseFunctionResolver = {
  [ease in AnimationEase]: (...args) => number;
};

export interface AnimateSettings {
  duration: number;
  ease?: AnimationEase;
}

export type AnimationValue = number | string;

export type Interpolator = (progress) => any;

export type EnterInterpolatorProvider = (to: AnimationValue, instance?: any) => Interpolator;

export type TransitoryInterpolatorProvider = (from: AnimationValue, to: AnimationValue, instance?: any) => Interpolator;

export type ExitInterpolatorProvider = (from: AnimationValue, instance?: any) => Interpolator;

export type EnterValueProvider = (to: AnimationValue, instance?: any) => AnimationValue;

export type TransitoryValueProvider = (from: AnimationValue, to: AnimationValue, instance?: any) => AnimationValue;

export type ExitValueProvider = (from: AnimationValue, instance?: any) => AnimationValue;

export interface AnimationConfig {
  enter?: EnterInterpolatorProvider | EnterValueProvider;
  transitory?: TransitoryInterpolatorProvider | TransitoryValueProvider;
  exit?: ExitInterpolatorProvider | ExitValueProvider;
  nodeName: string;
  attribute: string;
}
