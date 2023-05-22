import { HeadCell } from "../../SapoGridSticky.types";

interface StickyGridHeaderProps {
  cells: HeadCell[];
  sticky?: boolean;
  top?: number;
}

export default StickyGridHeaderProps;
