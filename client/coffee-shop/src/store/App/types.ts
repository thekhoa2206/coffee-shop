import { Theme } from "@material-ui/core";
import { HeaderLink } from "shared/model/routing/route.model";

export type ApplicationState = {
  header?: HeaderLink | string | null;
  loadingPage: boolean;
  sapoTheme: Theme;
};
