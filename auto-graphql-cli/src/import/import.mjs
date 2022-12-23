export function addImport(item, path, template) {
  path = path.replace('[]', '');
  item = item.replace('[]', '');
  const statement = `import { ${item} } from '${path}';`;
  template = template.split('\n');

  for (let element of template) {

    if (element.includes(path) && !element.includes(item)) {
      let newElement = '';
      let splitElement = element.split(' ');
      const index = splitElement.indexOf('{') + 1;

      splitElement.splice(index, 0,  item + ', ');

      template.splice(template.indexOf(element), 1, splitElement.join(' '));
      return unSplitTemplate(template);
    }
  }
  template.unshift(statement);

  return unSplitTemplate(template);
}

function unSplitTemplate(template) {
  let newTemplate = '';

  for (let element of template) {
    newTemplate = newTemplate + element + '\n';
  }
  return newTemplate;
}
