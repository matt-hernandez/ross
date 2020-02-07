import { ChartComponent } from '../../components/chart/chart.component';
import { lensPath, view, without } from 'ramda';
import { Constructor } from '../interfaces/common-types/constructor';

export function Stylable<TBase extends Constructor>(Base: TBase) {
  abstract class Mixed extends Base {
    abstract style: { [key: string]: any };
    abstract chart: ChartComponent;
    abstract rootStylePath: string;

    /**
     * This function fetches a styling property for an element based
     * on the path it would normally be found in a theme. If a style
     * can be found inside a local `style` input first, that is the
     * style prop that will be used.
     * @param path - The path to the style prop, using dot notation (i.e. `axis.ticks.stroke`)
     * @param args - Any other arguments passed to this function. These will be used in case
     * the value of the custom style property is a function.
     */
    getStyleProp(path: string, ...args): any {
      const { style, rootStylePath } = this;
      const resolvedPath = path.split('.');
      const rootPath = rootStylePath.split('.');
      if (style) {
        let localStyle;
        const localLensPath = without(rootPath, resolvedPath);
        const localLens = lensPath(localLensPath);
        localStyle = view(localLens, style);
        if (localStyle !== undefined) {
          if (typeof localStyle === 'function') {
            return localStyle(...args);
          }
          return localStyle;
        }
      }
      const { chart } = this;
      const lens = lensPath(resolvedPath);
      return view(lens, chart.theme);
    }
  }
  return Mixed as Constructor<Mixed>;
}
export type StylableComponent = InstanceType<ReturnType<typeof Stylable>>;
