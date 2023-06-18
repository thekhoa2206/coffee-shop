import React from "react";

export type SortFilterType = {
  highlights: string[];
  other: string[];
};
export interface SapoFilterProps {
  open: boolean;
  onDelete: () => void;
  onClose: () => void;
  children: React.ReactNode;
  onSubmit: () => void;
  classRoot?: string;
  isShowButtonToggleSortMode?: boolean;
  handleClickButtonToggleSortMode?: () => void;
  enableSortMode?: boolean;
  handleSaveSortFilter?: () => void;
  onCancelSortFilter?: () => void;
  loading?: boolean;
}
