const fs = require('fs');
const generateComponent = require('./templates/component/generate');
const generateDirective = require('./templates/directive/generate');
const serviceDirective = require('./templates/service/generate');

const args = process.argv.slice(2);
const [ type, name, ...rest ] = args;
const COMPONENT_ARG = 'component';
const DIRECTIVE_ARG = 'directive';
const SERVICE_ARG = 'service';

if (args.length < 2) {
  throw new Error('Generate script does not have the correct number of arguments.');
}

if (![COMPONENT_ARG, DIRECTIVE_ARG, SERVICE_ARG].includes(type)) {
  throw new Error(`First argument for generating files not recognized. Must be either '${COMPONENT_ARG}', '${DIRECTIVE_ARG}', or '${SERVICE_ARG}'.`);
}

if (type === 'component') {
  generateComponent(name, ...rest);
}

if (type === 'directive') {
  generateDirective(name);
}

if (type === 'service') {
  serviceDirective(name);
}
