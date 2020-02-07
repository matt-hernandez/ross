const fs = require('fs');
const path = require('path');
const resolveMixinProps = require('./resolve-mixin-props');
const dashToPascalCase = require('../util/dash-to-pascal-case');
const directoryRoot = path.resolve(__dirname, '../../');

module.exports = function (name, ...rest) {
  const pascalCaseName = dashToPascalCase(name);
  let componentTemplateRaw = fs.readFileSync(`${directoryRoot}/templates/component/component-template`, 'utf8');
  const componentTemplate = resolveMixinProps(name, componentTemplateRaw, ...rest);
  const newDirectoryPath = `${directoryRoot}/projects/ross/src/lib/components/${name}`;
  fs.mkdirSync(newDirectoryPath);
  fs.writeFileSync(`${newDirectoryPath}/${name}.component.ts`, componentTemplate);
  let htmlTemplate = fs.readFileSync(`${directoryRoot}/templates/component/component-template-html`, 'utf8');
  htmlTemplate = htmlTemplate.replace(/ComponentTemplate/g, pascalCaseName);
  fs.writeFileSync(`${newDirectoryPath}/${name}.component.html`, htmlTemplate);
  let specTemplate = fs.readFileSync(`${directoryRoot}/templates/component/component-template-spec`, 'utf8');
  specTemplate = specTemplate.replace(/component-template/g, name);
  specTemplate = specTemplate.replace(/ComponentTemplate/g, pascalCaseName);
  fs.writeFileSync(`${newDirectoryPath}/${name}.component.spec.ts`, specTemplate);
  let moduleTemplate = fs.readFileSync(`${directoryRoot}/templates/component/component-template-module`, 'utf8');
  moduleTemplate = moduleTemplate.replace(/component-template/g, name);
  moduleTemplate = moduleTemplate.replace(/ComponentTemplate/g, pascalCaseName);
  fs.writeFileSync(`${newDirectoryPath}/${name}.module.ts`, moduleTemplate);
  let moduleFileRaw = fs.readFileSync(`${directoryRoot}/projects/ross/src/lib/ross.module.ts`, 'utf8');
  moduleFileRaw = moduleFileRaw.replace(`/* Components Block End */`, `import { ${pascalCaseName}ComponentModule } from './components/${name}/${name}.module';
/* Components Block End */`);
  moduleFileRaw = moduleFileRaw.replace(`/* Components Exports Block End */`, `${pascalCaseName}ComponentModule,
    /* Components Exports Block End */`);
  fs.writeFileSync(`${directoryRoot}/projects/ross/src/lib/ross.module.ts`, moduleFileRaw);
}