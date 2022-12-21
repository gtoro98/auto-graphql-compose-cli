import { ContentTC } from "./subcategory.model";

const subcategoryQueries = {
  content: ContentTC.mongooseResolvers.findOne(),
  contents: ContentTC.mongooseResolvers.findMany({
    limit: { defaultValue: 1000000 },
  }),
  contentPagination: ContentTC.mongooseResolvers.pagination(),
};

const subcategoryMutations = {
  createContent: ContentTC.mongooseResolvers.createOne(),
  updateContent: ContentTC.mongooseResolvers.updateOne(),
};

export { contentQueries, contentMutations };
