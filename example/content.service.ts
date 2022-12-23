import type {
  FilterQuery,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { IContent, Content } from './content.model';

export async function findOne(
  filter?: FilterQuery<IContent>,
  projection?: ProjectionType<IContent> | null,
  options?: QueryOptions<IContent> | null
) {
  return Content.findOne(filter, projection, options).exec();
}

export async function find(
  filter?: FilterQuery<IContent>,
  projection?: ProjectionType<IContent> | null,
  options?: QueryOptions<IContent> | null
) {
  return Content.find(filter, projection, options).exec();
}

export async function updateOne(
  filter: FilterQuery<IContent>,
  update: UpdateQuery<IContent>,
  options?: QueryOptions<IContent> | null
) {
  return Content.updateOne(filter, update, options).exec();
}

export async function create(content: IContent) {
  return Content.create(content);
}
