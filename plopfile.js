module.exports = (plop) => {
  const NAMING = {
    fileCase: 'kebabCase', // options: kebabCase, camelCase, pascalCase, snakeCase
    variableCase: 'camelCase', // options: camelCase, pascalCase
  };

  const basePath = './src';

  // Helpers
  const normalizeInput = (text) =>
    text
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();

  const toKebabCase = (text) =>
    normalizeInput(text)
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  const toCamelCase = (text) => normalizeInput(text).replace(/-([a-z])/g, (_, g1) => g1.toUpperCase());

  const toPascalCase = (text) => toCamelCase(text).replace(/^./, (c) => c.toUpperCase());

  const toSnakeCase = (text) =>
    normalizeInput(text)
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');

  plop.setHelper('kebabCase', toKebabCase);
  plop.setHelper('camelCase', toCamelCase);
  plop.setHelper('pascalCase', toPascalCase);
  plop.setHelper('snakeCase', toSnakeCase);

  plop.setGenerator('module', {
    description: 'Generate module (controller, service, route, validation, model)',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Module name (e.g. user, product):',
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'Select features to include:',
        choices: [
          { name: 'Controller', value: 'controller', checked: true },
          { name: 'Service', value: 'service', checked: true },
          { name: 'Route', value: 'route', checked: true },
          { name: 'Validation', value: 'validation', checked: true },
        ],
      },
    ],
    actions: (data) => {
      const actions = [];

      // Dynamically apply selected naming helpers
      const fileName = plop.getHelper(NAMING.fileCase)(data.name);
      const variableName = plop.getHelper(NAMING.variableCase)(data.name);

      // Expose them to generators
      data.fileName = fileName;
      data.variableName = variableName;

      if (data.features.includes('route')) {
        actions.push({
          type: 'add',
          path: `${basePath}/routes/${fileName}.routes.ts`,
          templateFile: 'generators/route.hbs',
        });

        actions.push({
          type: 'modify',
          path: `${basePath}/routes/v1/index.ts`,
          pattern: /(import express from 'express';\n)/,
          template: `$1import ${variableName}Route from './${fileName}.routes';\n`,
        });

        actions.push({
          type: 'modify',
          path: `${basePath}/routes/v1/index.ts`,
          pattern: /(const defaultRoutes = \[\n)/,
          template: `$1  {\n    path: '/${fileName}',\n    route: ${variableName}Route,\n  },\n`,
        });
      }

      if (data.features.includes('controller')) {
        actions.push({
          type: 'add',
          path: `${basePath}/controllers/${fileName}.controller.ts`,
          templateFile: 'generators/controller.hbs',
        });
      }

      if (data.features.includes('service')) {
        actions.push({
          type: 'add',
          path: `${basePath}/services/${fileName}.service.ts`,
          templateFile: 'generators/service.hbs',
        });
      }

      if (data.features.includes('validation')) {
        actions.push({
          type: 'add',
          path: `${basePath}/validations/${fileName}.validation.ts`,
          templateFile: 'generators/validation.hbs',
        });
      }
      return actions;
    },
  });
};
