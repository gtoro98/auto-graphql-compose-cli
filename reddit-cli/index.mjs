#! /usr/bin/env node
import yargs from 'yargs';
import { createController } from './controller/controller.mjs';
import { readFile, writeFile } from 'fs/promises';
import { createModel } from './model/model.mjs';
import { createService } from './service/service.mjs';
import { createDto } from './dto/dto.mjs';

const { argv } = yargs(process.argv);
const model = [];
try {
  let file = await readFile(process.cwd() + '/table_model.txt', 'utf-8');
  let input = file.split('\n');

  let component = input.shift().split(' ')[1];

  for (let i = 0; i < input.length; i++) {
    let line = input[i].trim().split(' ')

    let attribute = {
      name: line.shift(),
      type: line.shift(),
      rest: line.join(),
    };
    model.push(attribute);
  }
  console.log(model);
  const data = {
    component: component,
  };
  createModel(model, component);
  createController(component);
  createService(component);
  createDto(component);
} catch (err) {
  console.log(err);
}
console.log('Fuera del try');
