import { addressSchema,  IAddress } from '../address';
import { ISubcategory } from '../subcategory';
import { ICategory } from '../category';
import { multimediaSchema,  IMultimedia } from '../multimedia';
import { Schema, Document, Types, Model, model, models } from 'mongoose';
import { composeMongoose } from "graphql-compose-mongoose";
import slugs from "slugs";
import mongooseAlgolia from "mongoose-algolia";

export interface ICompany {
  _id: any;
  name: string;
  description: string;
  logo: IMultimedia;
  category: Types.ObjectId | ICategory;
  subcategory: Array<Types.ObjectId | ISubcategory>;
  addresses: Array<IAddress>;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CompanyDocument = Document<Types.ObjectId, any, ICompany> &
  ICompany;


const companySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    logo: multimediaSchema,
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    },
    subcategory: [{
      type: Schema.Types.ObjectId,
      ref: 'Subcategory'
    }],
    addresses: [addressSchema],
    active: [{
      type: Boolean,
      default: true
    }],
  },
  { timestamps: true }
  );


export const Company =
  (models.Company as Model<CompanyDocument> & {
    SyncToAlgolia?: any;
    SyncAlgoliaSettings?: any;
}) ||
  model<
  CompanyDocument,
  Model<CompanyDocument> & {
    SyncToAlgolia?: any;
    SyncAlgoliaSettings?: any;
    }
  >('Company', companySchema);

export const CompanyTC = composeMongoose(Company);






