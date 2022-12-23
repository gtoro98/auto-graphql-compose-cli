#! /usr/bin/env node
import yargs from 'yargs';
import { createController } from './controller/controller.mjs';
import { readFile, writeFile } from 'fs/promises';
import { createModel } from './model/model.mjs';
import { createService } from './service/service.mjs';
import { createDto } from './dto/dto.mjs';
import { createIndex } from './index/index.mjs';

const { argv } = yargs(process.argv);
const model = [];
try {
  let file = await readFile(process.cwd() + '/table_model.txt', 'utf-8');
  let input = file.split('\n');

  let component = input.shift().split(' ')[1];

  for (let i = 0; i < input.length-1; i++) {
    let line = input[i].trim().split(' ')
    let attribute

    if(line.length >= 3){
      attribute = {
        name: line.shift().replace(/[^0-9a-z[-]]/gi, ''),
        type: line
          .shift()
          .replace(/[^0-9a-z[-]]/gi, '')
          .replace(/['"]+/g, ''),
        rest: line.join(),
      };
      model.push(attribute);
    }else if(line.length == 2){
      attribute = {
        name: line.shift().replace(/[^0-9a-z[-]]/gi, ''),
        type: line
          .shift()
          .replace(/[^0-9a-z[-]]/gi, '')
          .replace(/['"]+/g, ''),
        rest: [],
    }
    model.push(attribute);
  }


  }

  const data = {
    component: component,
  };
  createModel(model, component);
  createController(component);
  createService(component);
  createDto(component);
  createIndex(component);
} catch (err) {
  console.log(err);
}
