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
  for (let x = 0; x < model.length; x++) {
    I = I + addInterfaceAtribute(model[x]);
  }
  I = I + '}';
  template = template.replace('${Interface}', I);
}

function addInterfaceAtribute(attribute) {
  let isArray = '';
  let isArrayClose = '';
  //console.log(attribute);
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
      return '  ' + attribute['name'] + ': ' + isArray + 'Date'+ isArrayClose + ';\n';
    default:
      let notEmbeded = 'Types.ObjectId | ';
      template = addImport(
        'I' + attribute['type'],
        `../${attribute['type'].toLowerCase()}`,
        template
      );
      if(attribute['rest'].includes('embed')){
        notEmbeded = '';
      }
      return (
        '  ' +
        attribute['name'] +
        ': ' +
        isArray +
        notEmbeded +
        'I' + attribute['type'].replace('[]', '') +
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
    if (attribute['type'].includes('[]') || attribute['rest'].includes('>')) {
      isArray = '[';
      isArrayClose = ']';
    }
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
        if(attribute['rest'].includes('embed')){
          template = addImport(
             attribute['type'].toLowerCase()+'Schema',
            `../${attribute['type']
              .toLowerCase()}`,
            template
          );
          S =
            S +
            `
    ${attribute['name']}: ${isArray}${attribute['type']
              .replace('[]', '')
              .toLowerCase()}Schema${isArrayClose},`;
          break;
        }
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
