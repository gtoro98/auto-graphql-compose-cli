#! /usr/bin/env node
import { readFile, writeFile } from 'fs/promises';
import { addImport } from '../import/import.mjs';

var template;

export async function createModel(model, component) {
  try {
    template = await readFile(
      new URL('model_template.ts', import.meta.url),
      'utf-8'
    );
    addInterface(model, component);
    addDocument(component);
    addSchema(model, component);
    addTC(component);

    await writeFile(
      process.cwd() + '/' + component.toLowerCase() + '.model.ts',
      template
    );
  } catch (err) {
    console.log(err);
  }
}

function addInterface(model, component) {
  let I = `export interface I${component} {\n`;
  for (let x = 0; x < model.length - 2; x++) {
    console.log(model[x]);
    I = I + addInterfaceAtribute(model[x]);
  }
  I = I + '}';
  template = template.replace('${Interface}', I);
}

function addInterfaceAtribute(attribute) {
  if (attribute['type'] == undefined || attribute['type'] == null) {
    return'';
  }
  if (
    attribute['type'].trim() == 'String' ||
    attribute['type'].trim() == 'Number' ||
    attribute['type'].trim() == 'Boolean'
  ) {
    return (
      '  ' + attribute['name'] + ': ' + attribute['type'].toLowerCase() + ';\n'
    );
  }
  switch (attribute['type']) {
    case 'ObjectId':
      return '  ' + attribute['name'] + ': any;\n';
    case 'Date':
      return '  ' + attribute['name'] + ': Date;\n';
    default:
      template = addImport(
        'I' + attribute['type'],
        `../${attribute['type'].toLowerCase()}/${attribute[
          'type'
        ].toLowerCase()}.model`,
        template
      );
      return (
        '  ' +
        attribute['name'] +
        ': Types.ObjectId | I' +
        attribute['type'] +
        ';\n'
      );
  }
}

function addDocument(component) {
  const D = `export type ${component}Document = Document<Types.ObjectId, any, I${component}> &
  I${component};\n`;

  template = template.replace('${Document}', D);
}

function addSchema(model, component) {
  let S = `const ${component.toLowerCase()}Schema = new Schema<I${component}>(\n  {`;

  for (let attribute of model) {
    switch (attribute['type']) {
      case 'ObjectId': {
        break;
      }
      case undefined: {
        break;
      }
      case 'String': {
        S =
          S +
          `
    ${attribute['name']}: {
      type: ${attribute['type']},
      trim: true
    },`;
        break;
      }
      case 'Boolean': {
        S =
          S +
          `
    ${attribute['name']}: {
      type: ${attribute['type']},
      default: true
    },`;
        break;
      }
      case 'Date': {
        break;
      }
      default: {
        S =
          S +
          `
    ${attribute['name']}: {
      type: Schema.Types.ObjectId,
      ref: '${attribute['type']}'
    },`;
        break;
      }
    }
  }

  S =
    S +
    `
  },
  { timestamps: true }
  );`;
  template = template.replace('${Schema}', S);
}

function addTC(component) {
  let TC = `
export const ${component} =
  (models.${component} as Model<${component}Document> & {
    SyncToAlgolia?: any;
    SyncAlgoliaSettings?: any;
}) ||
  model<
  ${component}Document,
  Model<${component}Document> & {
    SyncToAlgolia?: any;
    SyncAlgoliaSettings?: any;
    }
  >('${component}', ${component.toLowerCase()}Schema);

export const ${component}TC = composeMongoose(${component});`;

  template = template.replace('${TC}', TC);
}
