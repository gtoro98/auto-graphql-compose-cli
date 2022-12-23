import { IAddress } from '../address/address.model';
import { ISubcategory } from '../subcategory/subcategory.model';
import { ICategory } from '../category/category.model';
import { IMultimedia } from '../multimedia/multimedia.model';
import { Schema, Document, Types, Model, model, models } from 'mongoose';
import { composeMongoose } from "graphql-compose-mongoose";
import slugs from "slugs";
import mongooseAlgolia from "mongoose-algolia";

export interface ICompany {
  _id: any;
  logo: Types.ObjectId | IMultimedia;
  category: Types.ObjectId | ICategory;
  subcategory: Array<Types.ObjectId | ISubcategory>;
  addresses: Array<Types.ObjectId | IAddress>;
}

export type CompanyDocument = Document<Types.ObjectId, any, ICompany> &
  ICompany;


const companySchema = new Schema<ICompany>(
  {
    logo: {
      type: Schema.Types.ObjectId,
      ref: 'Multimedia'
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    },
    subcategory: [{
      type: Schema.Types.ObjectId,
      ref: 'Subcategory'
    }],
    addresses: [{
      type: Schema.Types.ObjectId,
      ref: 'Address'
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




