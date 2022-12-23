#! /usr/bin/env node
import { readFile, writeFile } from 'fs/promises';

export async function createController(component) {
  try {
    let template = await readFile(
      new URL('controller_template.txt', import.meta.url),
      'utf-8'
    );

    template = template.replaceAll('${Component}', component);
    template = template.replaceAll('${component}', component.toLowerCase());

    await writeFile(
      process.cwd() + '/' + component.toLowerCase() + '.controller.ts',
      template
    );
  } catch (err) {
    console.log(err);
  }
}
