export type DataSourceBase = {
  metaData: {
    currentPage: number;
    totalPage: number;
  };
  data: any;
};

export type QueryFilterType = {
  query?: string;
  page?: number;
};
