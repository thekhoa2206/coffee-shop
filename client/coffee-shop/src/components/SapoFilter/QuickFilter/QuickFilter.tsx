import { Theme } from "@material-ui/core";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { colorInk } from "theme/palette";

const useStyles = makeStyles((theme: Theme) => ({
  rootButtonGroup: {
    margin: "0 16px",
    "& .MuiButtonBase-root": {
      minWidth: 119,
      borderRadius: 3,
      fontWeight: 400,
      borderWidth: 1,
      "&.MuiButtonGroup-groupedHorizontal:not(:last-child)": {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderRightColor: "transparent",
      },
      "&.MuiButtonGroup-groupedHorizontal:not(:first-child)": {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
      },
      "& .MuiButton-endIcon": {
        color: colorInk.base40,
      },

      "&.MuiButton-outlined": {
        padding: "0 12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: `1px solid #d3d5d7`,
      },
    },
  },
}));

interface QuickFilterProps {
  children: React.ReactNode;
  isFileMission?: boolean;
}

const QuickFilter = (props: QuickFilterProps) => {
  const classes = useStyles();
  return (
    <ButtonGroup style={props.isFileMission ? { margin: "0px" } : {}} classes={{ root: classes.rootButtonGroup }}>
      {props.children}
    </ButtonGroup>
  );
};

export default QuickFilter;
