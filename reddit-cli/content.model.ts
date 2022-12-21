import { IUser } from '../user/user.model';

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

