export default interface TagFilterItemProps {
  label: string;
  filterType: string;
  filterName: string;
  handleClick: (filterName: string) => void;
  handleDelete: (filterType: string) => void;
}

export interface TagFilterItemType {
  filterType: string; // cái này là key của Filter object phục vụ việc ấn xóa bộc lọc ở tag filter bên ngoài, có thể là nhiều key cách nhau bằng dấu phẩy
  filterName: string; // cái này để lúc ấn vào tag filter item bên ngoài mở bộ lọc và scroll đến vị trí bộ lọc đó
  label: string;
  value?: any;
}
