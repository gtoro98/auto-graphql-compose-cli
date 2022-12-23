#! /usr/bin/env node
import { readFile, writeFile } from 'fs/promises';
import { addImport } from '../import/import.mjs';

var template;
var relations = '';

export async function createModel(model, component) {
  try {
    template = await readFile(
      new URL('model_template.ts', import.meta.url),
      'utf-8'
    );
    addAttributes(model, component);
    addDocument(component);
    //addSchema(model, component);
    addTC(component);

    await writeFile(
      process.cwd() + '/' + component.toLowerCase() + '.model.ts',
      template
    );
  } catch (err) {
    console.log(err);
  }
}
function addAttributes(model, component) {
  let I = `export interface I${component} {\n`;
  let S = `const ${component.toLowerCase()}Schema = new Schema<I${component}>(\n  {`;

  for (let x = 0; x < model.length; x++) {
    I = I + addInterfaceAttribute(model[x], component);
    S = S + addSchemaAttribute(model[x]);
  }
  I = I + '}';
  S =
    S +
    `
  },
  { timestamps: true }
  );`;
  template = template.replace('${Schema}', S);
  template = template.replace('${Interface}', I);
  template = template.replace('${Relations}', relations);
}

function addInterfaceAttribute(attribute, component) {
  let isArray = '';
  let isArrayClose = '';
  //console.log(attribute);
  if (attribute['type'] == undefined || attribute['type'] == null) {
    return '';
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
      }else{
        if(isArray === ''){
          addRelation(attribute, component);
        }else {
          addRelations(attribute, component);
        }
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

function addSchemaAttribute(attribute) {
  let isArray = '';
  let isArrayClose = '';
  if (attribute['type'] == undefined || attribute['type'] == null) {
    return ''
  }
  if (attribute['type'].includes('[]') || attribute['rest'].includes('>')) {
    isArray = '[';
    isArrayClose = ']';
  }
  switch (attribute['type']) {
    case 'ObjectId': {
      return '';
    }
    case undefined: {
      return '';
    }
    case 'String': {
      return `
  ${attribute['name']}: ${isArray}{
    type: ${attribute['type']},
    trim: true
  }${isArrayClose},`;
    }
    case 'Boolean': {
      return `
  ${attribute['name']}: ${isArray}{
    type: ${attribute['type']},
    default: true
  }${isArrayClose},`;
    }
    case 'Date': {
      return '';
    }
    default: {
      if (attribute['rest'].includes('embed')) {
        template = addImport(
          attribute['type'].toLowerCase() + 'Schema',
          `../${attribute['type'].toLowerCase()}`,
          template
        );
        return `
  ${attribute['name']}: ${isArray}${attribute['type']
            .replace('[]', '')
            .toLowerCase()}Schema${isArrayClose},`;
      }
      return `
  ${attribute['name']}: ${isArray}{
    type: Schema.Types.ObjectId,
    ref: '${attribute['type'].replace('[]', '')}'
  }${isArrayClose},`;
    }
  }
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

function addRelation(attribute, component) {
  template = addImport(
    attribute['type'] + 'TC',
    `../${attribute['type'].toLowerCase()}`,
    template
  );

  relations =
    relations +
    `
${component}TC.addRelation('${attribute['name']}', {
  resolver: ${attribute['type']}TC.mongooseResolvers.dataLoader(),
  prepareArgs: {
    _ids: (source) => source.${attribute['name']},
  },
  projection: {
    ${attribute['name']}: 1,
  },
});`;
}
function addRelations(attribute, component) {
  template = addImport(
    attribute['type'] + 'TC',
    `../${attribute['type'].toLowerCase()}`,
    template
  );

  relations =
    relations +
    `
${component}TC.addRelation('${attribute['name']}s', {
  resolver: ${attribute['type']}TC.mongooseResolvers.dataLoaderMany(),
  prepareArgs: {
    _ids: (source) => source.${attribute['name']}s,
  },
  projection: {
    ${attribute['name']}s: 1,
  },
});`;
}
