const fs = require('fs');
const path = require('path');
const { compose, concat, filter, map, transduce, uniqBy, unnest } = require('ramda');
const dashToPascalCase = require('../util/dash-to-pascal-case');
const directoryRoot = path.resolve(__dirname, '../../');
const mixinsFolder = `${directoryRoot}/projects/ross/src/lib/util/mixins`;

const firstElement = arr => arr[0];
const filterOutContainerOrChart = filter(arr => !(arr.includes('container') || arr.includes('chart')));
const joinWithColon = map(arr => arr.join(': '));
const appendTerminatorAndLine = map(str => `  ${str};\n`);
const transducer = compose(joinWithColon, appendTerminatorAndLine);

module.exports = function (name, template, ...mixinArgs) {
  const STYLABLE_MIXIN_ARG = '--stylable';
  const POSITIONABLE_MIXIN_ARG = '--positionable';
  const DATA_VISUALIZABLE_MIXIN_ARG = '--data-visualizable';
  const ANIMATABLE_MIXIN_ARG = '--animatable';
  const DATA_SUBSCRIBABLE = '--data-subscribable';
  const SINGLE_DATUM_HOLDER = '--single-datum-holder';
  if (mixinArgs.length > 0) {
    const mixins = [
      STYLABLE_MIXIN_ARG,
      POSITIONABLE_MIXIN_ARG,
      DATA_VISUALIZABLE_MIXIN_ARG,
      ANIMATABLE_MIXIN_ARG,
      DATA_SUBSCRIBABLE,
      SINGLE_DATUM_HOLDER
    ];
    mixinArgs.forEach(mixin => {
      if (!mixins.includes(mixin)) {
        throw new Error('Unknown mixin specified.');
      }
    });
  }
  const dashCaseName = name;
  const pascalCaseName = dashToPascalCase(name);
  const mixinImports = [];
  const extendsParents = [];
  const extendsMixins = [];
  const mixinProps = [];
  if (mixinArgs.includes(STYLABLE_MIXIN_ARG)) {
    mixinImports.push(`import { Stylable } from '../../util/mixins/stylable';`);
    extendsMixins.push('Stylable');
    mixinProps.push(mixinAbstractProps(`${mixinsFolder}/stylable.ts`));
  }
  if (mixinArgs.includes(POSITIONABLE_MIXIN_ARG)) {
    mixinImports.push(`import { Positionable } from '../../util/mixins/positionable';`);
    extendsMixins.push('Positionable');
    mixinProps.push(mixinAbstractProps(`${mixinsFolder}/positionable.ts`));
  }
  if (mixinArgs.includes(DATA_VISUALIZABLE_MIXIN_ARG)) {
    mixinImports.push(`import { DataVisualizable } from '../../util/mixins/data-visualizable';`);
    extendsMixins.push('DataVisualizable');
    mixinProps.push(mixinAbstractProps(`${mixinsFolder}/data-visualizable.ts`));
  }
  if (mixinArgs.includes(ANIMATABLE_MIXIN_ARG)) {
    mixinImports.push(`import { Animatable } from '../../util/mixins/animatable';`);
    extendsMixins.push('Animatable');
    mixinProps.push(mixinAbstractProps(`${mixinsFolder}/animatable.ts`));
  }
  if (mixinArgs.includes(DATA_SUBSCRIBABLE)) {
    mixinImports.push(`import { DataSubscribable } from '../../util/mixins/data-subscribable';`);
    extendsMixins.push('DataSubscribable');
    mixinProps.push(mixinAbstractProps(`${mixinsFolder}/data-subscribable.ts`));
  }
  if (mixinArgs.includes(SINGLE_DATUM_HOLDER)) {
    mixinImports.push(`import { SingleDatumHolder } from '../../util/mixins/single-datum-holder';`);
    extendsMixins.push('SingleDatumHolder');
    mixinProps.push(mixinAbstractProps(`${mixinsFolder}/single-datum-holder.ts`));
  }
  const mixinImportsString = mixinArgs.length ? `import { applyMixins } from '../../util/functions/mixins';\n${mixinImports.join('\n')}\n` : '';
  template = template.replace('/* MIXINS */', mixinImportsString);
  template = template.replace(/component-template/g, dashCaseName);
  template = template.replace(/ComponentTemplate/g, pascalCaseName);
  const mixinExtendsString = mixinArgs.length ? `\n  extends applyMixins([${extendsMixins.join(', ')}])` : '';
  template = template.replace('/* EXTENDS */', mixinExtendsString);
  const mixinImplementsString = ' implements OnInit, BaseChartComponent';
  template = template.replace('/* IMPLEMENTS */', mixinImplementsString);
  const properties = filterOutContainerOrChart(uniqBy(firstElement, unnest(mixinProps)));
  const propertiesString = transduce(transducer, concat, '\n', properties);
  template = template.replace('/* PROPERTIES */', propertiesString);
  const superString = mixinArgs.length ? '\n    super();' : '';
  template = template.replace('/* SUPER */', superString);
  return template;
}

function mixinAbstractProps(filePath) {
  const mixinFile = fs.readFileSync(filePath, 'utf8');
  let props = mixinFile.match(/abstract ([a-z][a-z0-9A-Z ]*?(\(\))?(: .*)?;)/g);
  props = map(prop => prop.replace('abstract ', ''), props);
  props = map(prop => {
    const propName = prop.match(/([a-z][a-z0-9A-Z ]*\(?\)?)/)[1];
    const propSet = [ propName ];
    if (prop.charAt(propName.length) === ':') {
      const propType = prop.match(/: (.*?);/)[1];
      propSet.push(propType);
    }
    return propSet;
  }, props);
  return props || [];
}
