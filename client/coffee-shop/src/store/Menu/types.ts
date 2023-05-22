export interface MenuItem {
    id?: string;
    icon?: any;
    title: string;
    path?: string;
    includePaths?: string[]; //list path để check menu active
    excludePaths?: string[]; //list path bị loại trừ để k check menu active
    typeRoute?: "reload" | "default" | "event";
    linkTarget?: string;
    subMenus?: MenuItem[];
    typeMenu?: string;
    hasSubMenu?: boolean;
    textPromotion?: string;
    checkIsExact?: boolean;
    appAlias?: string[] | string | null;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    isActive?: boolean; //xử lý cho phần /admin/apps
  }

  export type MenuState = {
    menuItems: MenuItem[];
    isLoadingMenu: boolean;
    collapse: boolean;
    isAddChannel: boolean;
    isHidden: boolean;
  };