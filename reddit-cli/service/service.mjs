#! /usr/bin/env node
import { readFile, writeFile } from 'fs/promises';

export async function createService(component) {
  try {
    let template = await readFile(
      new URL('service_template.ts', import.meta.url),
      'utf-8'
    );

    template = template.replaceAll('${Component}', component);
    template = template.replaceAll('${component}', component.toLowerCase());

    await writeFile(
      process.cwd() + '/' + component.toLowerCase() + '.service.ts',
      template
    );
  } catch (err) {
    console.log(err);
  }
}
