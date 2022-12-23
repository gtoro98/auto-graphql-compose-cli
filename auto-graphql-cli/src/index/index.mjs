#! /usr/bin/env node
import { readFile, writeFile } from 'fs/promises';

export async function createIndex(component) {
  try {
    let template = await readFile(
      new URL('index_template.ts', import.meta.url),
      'utf-8'
    );
    template = template.replaceAll('${component}', component.toLowerCase());

    await writeFile(
      process.cwd() + '/' + component.toLowerCase() + '.index.ts',
      template
    );
  } catch (err) {
    console.log(err);
  }
}
