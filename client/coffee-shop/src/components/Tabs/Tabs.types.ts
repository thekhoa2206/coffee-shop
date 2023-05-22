import { TabProps, TabsActions } from "@material-ui/core";
import { WithStyles } from "@material-ui/styles";
import styles from "./Tabs.styles";

export interface TabsProps extends WithStyles<typeof styles> {
  action?: React.Ref<TabsActions>;
  centered?: boolean;
  children?: React.ReactNode;
  indicatorColor?: "secondary" | "primary" | string;
  onChange?: (event: React.ChangeEvent<{}>, value: any) => void;
  orientation?: "horizontal" | "vertical";
  ScrollButtonComponent?: React.ElementType;
  scrollButtons?: "auto" | "desktop" | "on" | "off";
  TabIndicatorProps?: Partial<React.HTMLAttributes<HTMLDivElement>>;
  textColor?: "secondary" | "primary" | "inherit" | string;
  value: any;
  variant?: "standard" | "scrollable" | "fullWidth";
  width?: string;
  className?: string;
  style?: React.CSSProperties;
}

export interface ITab extends TabProps {
  type?:
    | "normal"
    | "status"
    | "savedSearch"
    | "searchResult"
    | "medicine"
    | "unRefund"
    | "unReceive"
    | "composite_fulfillment_statuses"
    | "collated"
    | "collating"
    | "SAPOEXPRESS"
    | "source_location_ids"
    | "destination_location_ids";
  json_content?: string;
}
