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
    console.log(model);
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
  for (let x = 0; x < model.length; x++) {
    I = I + addInterfaceAtribute(model[x]);
  }
  I = I + '}';
  template = template.replace('${Interface}', I);
}

function addInterfaceAtribute(attribute) {
  let isArray = '';
  let isArrayClose = '';
  console.log(attribute);
  if (attribute['type'] == undefined || attribute['type'] == null) {
    return'';
  }
  if(attribute['type'].includes('[]') || attribute['rest'].includes('>')){
    isArray = 'Array<';
    isArrayClose = '>';
  }
  if (
    attribute['type'].trim() == 'String' ||
    attribute['type'].trim() == 'Number' ||
    attribute['type'].trim() == 'Boolean'
  ) {
    return (
      '  ' +
      attribute['name'] +
      ': ' +
      isArray +
      attribute['type'].toLowerCase() +
      isArrayClose +
      ';\n'
    );
  }
  switch (attribute['type']) {
    case 'ObjectId':
      return '  ' + attribute['name'] + ': any;\n';
    case 'Date':
      return '  ' + attribute['name'] + ':' + isArray + 'Date'+ isArrayClose + ';\n';
    default:
      template = addImport(
        'I' + attribute['type'].replace('[]', ''),
        `../${attribute['type'].replace('[]', '').toLowerCase()}/${attribute[
          'type'
        ].toLowerCase()}.model`,
        template
      );
      return (
        '  ' +
        attribute['name'] +
        ': ' +
        isArray +
        'Types.ObjectId | I' +
        attribute['type'].replace('[]', '') +
        isArrayClose +
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
  let isArray = '';
  let isArrayClose = '';
  for (let attribute of model) {
    if(attribute['type'] == undefined || attribute['type'] == null){
      continue;
    }
    console.log(attribute['type'])
    if (attribute['type'].includes('[]') || attribute['rest'].includes('>')) {
      isArray = '[';
      isArrayClose = ']';
    }
    console.log(isArray)
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
    ${attribute['name']}: ${isArray}{
      type: ${attribute['type']},
      trim: true
    }${isArrayClose},`;
        break;
      }
      case 'Boolean': {
        S =
          S +
          `
    ${attribute['name']}: ${isArray}{
      type: ${attribute['type']},
      default: true
    }${isArrayClose},`;
        break;
      }
      case 'Date': {
        break;
      }
      default: {
        S =
          S +
          `
    ${attribute['name']}: ${isArray}{
      type: Schema.Types.ObjectId,
      ref: '${attribute['type'].replace('[]', '')}'
    }${isArrayClose},`;
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
