import type {
  FilterQuery,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { I${Component}, ${Component} } from './${component}.model';

export async function findOne(
  filter?: FilterQuery<I${Component}>,
  projection?: ProjectionType<I${Component}> | null,
  options?: QueryOptions<I${Component}> | null
) {
  return ${Component}.findOne(filter, projection, options).exec();
}

export async function find(
  filter?: FilterQuery<I${Component}>,
  projection?: ProjectionType<I${Component}> | null,
  options?: QueryOptions<I${Component}> | null
) {
  return ${Component}.find(filter, projection, options).exec();
}

export async function updateOne(
  filter: FilterQuery<I${Component}>,
  update: UpdateQuery<I${Component}>,
  options?: QueryOptions<I${Component}> | null
) {
  return ${Component}.updateOne(filter, update, options).exec();
}

export async function create(${component}: I${Component}) {
  return ${Component}.create(${component});
}
