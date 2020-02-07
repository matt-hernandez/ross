const fs = require('fs');
const path = require('path');
const dashToPascalCase = require('../util/dash-to-pascal-case');
const directoryRoot = path.resolve(__dirname, '../../');

module.exports = function (name) {
  const newDirectoryPath = `${directoryRoot}/projects/ross/src/lib/directives/${name}`;
  fs.mkdirSync(newDirectoryPath);
  const pascalCaseName = dashToPascalCase(name);
  let directiveTemplate = fs.readFileSync(`${directoryRoot}/templates/directive/directive-template`, 'utf8');
  directiveTemplate = directiveTemplate.replace(/DirectiveTemplate/g, pascalCaseName);
  fs.writeFileSync(`${newDirectoryPath}/${name}.directive.ts`, directiveTemplate);
  let specTemplate = fs.readFileSync(`${directoryRoot}/templates/directive/directive-template-spec`, 'utf8');
  specTemplate = specTemplate.replace(/directive-template/g, name);
  specTemplate = specTemplate.replace(/DirectiveTemplate/g, pascalCaseName);
  fs.writeFileSync(`${newDirectoryPath}/${name}.directive.spec.ts`, specTemplate);
  let moduleFileRaw = fs.readFileSync(`${directoryRoot}/projects/ross/src/lib/directives/directives.module.ts`, 'utf8');
  moduleFileRaw = moduleFileRaw.replace(`/* Directives Block End */`, `import { ${pascalCaseName}Directive } from './${name}/${name}.directive';
/* Directives Block End */`);
  moduleFileRaw = moduleFileRaw.replace(`/* Directives Declarations Block End */`, `${pascalCaseName}Directive,
    /* Directives Declarations Block End */`);
  moduleFileRaw = moduleFileRaw.replace(`/* Directives Exports Block End */`, `${pascalCaseName}Directive,
    /* Directives Exports Block End */`);
  fs.writeFileSync(`${directoryRoot}/projects/ross/src/lib/directives/directives.module.ts`, moduleFileRaw);
}
