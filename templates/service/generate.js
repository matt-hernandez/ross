const fs = require('fs');
const path = require('path');
const dashToPascalCase = require('../util/dash-to-pascal-case');
const directoryRoot = path.resolve(__dirname, '../../');

module.exports = function (name) {
  const newDirectoryPath = `${directoryRoot}/projects/ross/src/lib/services/${name}`;
  fs.mkdirSync(newDirectoryPath);
  const pascalCaseName = dashToPascalCase(name);
  let serviceTemplate = fs.readFileSync(`${directoryRoot}/templates/service/service-template`, 'utf8');
  serviceTemplate = serviceTemplate.replace(/ServiceTemplate/g, pascalCaseName);
  fs.writeFileSync(`${newDirectoryPath}/${name}.service.ts`, serviceTemplate);
  let specTemplate = fs.readFileSync(`${directoryRoot}/templates/service/service-template-spec`, 'utf8');
  specTemplate = specTemplate.replace(/service-template/g, name);
  specTemplate = specTemplate.replace(/ServiceTemplate/g, pascalCaseName);
  fs.writeFileSync(`${newDirectoryPath}/${name}.service.spec.ts`, specTemplate);
  let moduleFileRaw = fs.readFileSync(`${directoryRoot}/projects/ross/src/lib/ross.module.ts`, 'utf8');
  moduleFileRaw = moduleFileRaw.replace(`/* Services Block End */`, `import { ${pascalCaseName}Service } from './services/${name}/${name}.service';
/* Services Block End */`);
  moduleFileRaw = moduleFileRaw.replace(`/* Services Declarations Block End */`, `${pascalCaseName}Service,
    /* Services Declarations Block End */`);
  moduleFileRaw = moduleFileRaw.replace(`/* Services Exports Block End */`, `${pascalCaseName}Service,
    /* Services Exports Block End */`);
  fs.writeFileSync(`${directoryRoot}/projects/ross/src/lib/ross.module.ts`, moduleFileRaw);
}
