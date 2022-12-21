export function addImport(item, path, template) {
  const statement = `import { ${item} } from '${path}';\n`;
  template = template.split('\n');

  for (let element of template) {
    //console.log(element);
    if (element.includes('path') && !element.includes('item')) {
      element = element
        .split(' ')
        .splice(element.indexOf('{'), 0, ' ' + item + ', ');

      return unSplitTemplate(
        template.splice(template.indexOf(element), 1, element)
      );
    }
  }
  template.unshift(statement);
  console.log(template);
  return unSplitTemplate(template);
}

function unSplitTemplate(template) {
  let newTemplate = '';

  for (let element of template) {
    newTemplate = newTemplate + element + '\n';
  }

  return newTemplate;
}
