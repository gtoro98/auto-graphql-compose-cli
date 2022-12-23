import type {
  FilterQuery,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { ICompany, Company } from './company.model';

export async function findOne(
  filter?: FilterQuery<ICompany>,
  projection?: ProjectionType<ICompany> | null,
  options?: QueryOptions<ICompany> | null
) {
  return Company.findOne(filter, projection, options).exec();
}

export async function find(
  filter?: FilterQuery<ICompany>,
  projection?: ProjectionType<ICompany> | null,
  options?: QueryOptions<ICompany> | null
) {
  return Company.find(filter, projection, options).exec();
}

export async function updateOne(
  filter: FilterQuery<ICompany>,
  update: UpdateQuery<ICompany>,
  options?: QueryOptions<ICompany> | null
) {
  return Company.updateOne(filter, update, options).exec();
}

export async function create(company: ICompany) {
  return Company.create(company);
}
