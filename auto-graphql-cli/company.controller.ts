import { CompanyTC } from "./company.model";

const companyQueries = {
  company: CompanyTC.mongooseResolvers.findOne(),
  companys: CompanyTC.mongooseResolvers.findMany({
    limit: { defaultValue: 1000000 },
  }),
  companyPagination: CompanyTC.mongooseResolvers.pagination(),
};

const companyMutations = {
  createCompany: CompanyTC.mongooseResolvers.createOne(),
  updateCompany: CompanyTC.mongooseResolvers.updateOne(),
};

export { companyQueries, companyMutations };
