import { SubcategoryTC,  ISubcategory } from '../subcategory';
import { CategoryTC,  ICategory } from '../category';
import { UserTC,  IUser } from '../user';
import { Schema, Document, Types, Model, model, models } from 'mongoose';
import { composeMongoose } from "graphql-compose-mongoose";
import slugs from "slugs";
import mongooseAlgolia from "mongoose-algolia";

export interface IContent {
  _id: any;
  title: string;
  description: string;
  isPrivate: boolean;
  creator: Types.ObjectId | IUser;
  category: Types.ObjectId | ICategory;
  subcategory: Types.ObjectId | ISubcategory;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ContentDocument = Document<Types.ObjectId, any, IContent> &
  IContent;


const contentSchema = new Schema<IContent>(
  {
  title: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  isPrivate: {
    type: Boolean,
    default: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  subcategory: {
    type: Schema.Types.ObjectId,
    ref: 'Subcategory'
  },
  active: {
    type: Boolean,
    default: true
  },
  },
  { timestamps: true }
  );


export const Content =
  (models.Content as Model<ContentDocument> & {
    SyncToAlgolia?: any;
    SyncAlgoliaSettings?: any;
}) ||
  model<
  ContentDocument,
  Model<ContentDocument> & {
    SyncToAlgolia?: any;
    SyncAlgoliaSettings?: any;
    }
  >('Content', contentSchema);

export const ContentTC = composeMongoose(Content);


ContentTC.addRelation('creator', {
  resolver: UserTC.mongooseResolvers.dataLoader(),
  prepareArgs: {
    _ids: (source) => source.creator,
  },
  projection: {
    creator: 1,
  },
});
ContentTC.addRelation('category', {
  resolver: CategoryTC.mongooseResolvers.dataLoader(),
  prepareArgs: {
    _ids: (source) => source.category,
  },
  projection: {
    category: 1,
  },
});
ContentTC.addRelation('subcategory', {
  resolver: SubcategoryTC.mongooseResolvers.dataLoader(),
  prepareArgs: {
    _ids: (source) => source.subcategory,
  },
  projection: {
    subcategory: 1,
  },
});






