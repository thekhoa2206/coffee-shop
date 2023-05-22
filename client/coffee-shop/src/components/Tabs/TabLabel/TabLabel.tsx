import { createStyles, makeStyles, Theme } from "@material-ui/core";
import React, { ReactNode } from "react";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

const useStylesTab = makeStyles((theme: Theme) =>
  createStyles({
    deleteTabIcon: {
      display: "none",
      position: "absolute",
      top: 2,
      right: 0,
      width: "0.9em",
      height: "0.9em",
    },
  })
);

export interface TabLabelProps {
  label: ReactNode;
  onDelete?: (e: React.MouseEvent<Element>) => void;
}


const TabLabel = (props: TabLabelProps) => {
  const { label, onDelete } = props;
  const classes = useStylesTab();
  const { t } = useTranslation(["component"]);
  const handleDelete = (e: React.MouseEvent<Element>) => {
    if (onDelete) onDelete(e);
  };
  return (
    <React.Fragment>
      {label}
      <HighlightOffIcon
        className={clsx(classes.deleteTabIcon, "deleteTabIcon")}
        onClick={handleDelete}
        titleAccess={t("component:button.delete")}
      />
    </React.Fragment>
  );
};

export default TabLabel;
