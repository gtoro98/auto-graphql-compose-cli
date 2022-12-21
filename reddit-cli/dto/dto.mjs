#! /usr/bin/env node
import { readFile, writeFile } from 'fs/promises';

export async function createDto(component) {
  try {
    let template = await readFile(
      new URL('dto_template.ts', import.meta.url),
      'utf-8'
    );

    template = template.replaceAll('${Component}', component);
    template = template.replaceAll('${component}', component.toLowerCase());

    await writeFile(
      process.cwd() + '/' + component.toLowerCase() + '.dto.ts',
      template
    );
  } catch (err) {
    console.log(err);
  }
}
