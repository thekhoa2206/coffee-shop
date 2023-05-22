import React from "react";

interface InfiniteScrollProps {
  scrollThreshold?: number | string;
  endMessage?: React.ReactNode;
  style?: React.CSSProperties;
  height?: number | string;
  scrollableTarget?: React.ReactNode;
  hasChildren?: boolean;
  inverse?: boolean;
  pullDownToRefresh?: boolean;
  pullDownToRefreshContent?: React.ReactNode;
  releaseToRefreshContent?: React.ReactNode;
  pullDownToRefreshThreshold?: number;
  refreshFunction?: () => any;
  onScroll?: (e: MouseEvent) => any;
  initialScrollY?: number;
  className?: string;
}

interface DataSource {
  data: any[];
  metaData: {
    totalPage: number;
    totalItems: number;
  };
}

export type { InfiniteScrollProps, DataSource };
