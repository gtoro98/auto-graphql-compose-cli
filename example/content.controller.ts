import { ContentTC } from "./content.model";

const contentQueries = {
  content: ContentTC.mongooseResolvers.findOne(),
  contents: ContentTC.mongooseResolvers.findMany({
    limit: { defaultValue: 1000000 },
  }),
  contentPagination: ContentTC.mongooseResolvers.pagination(),
};

const contentMutations = {
  createContent: ContentTC.mongooseResolvers.createOne(),
  updateContent: ContentTC.mongooseResolvers.updateOne(),
};

export { contentQueries, contentMutations };
