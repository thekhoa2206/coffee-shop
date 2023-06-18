export default interface FilterItemProps {
  label: string;
  children: any;
  active: boolean;
  forceClose?: string;
  sortMode?: boolean;
  filterName: string; // cái này để lúc ấn vào tag filter item bên ngoài mở bộ lọc và scroll đến vị trí bộ lọc đó
  isFilterHighlights?: boolean;
  handleSortItem?: (filterName: string, isHighlights: boolean) => void;
  index?: number;
  isDragDropItem?: boolean;
  onOpen?: () => void;
}
