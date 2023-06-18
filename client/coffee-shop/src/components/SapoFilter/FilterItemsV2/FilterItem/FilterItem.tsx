import React from "react";
import { Box } from "@material-ui/core";
import useStyles from "./FilterItem.styles";

interface FilterItemProps {
  style?: any;
}

const FilterItem: React.FC<FilterItemProps> = (props) => {
  const classes = useStyles();
  return (
    <Box className={classes.root} style={props.style}>
      {props.children}
    </Box>
  );
};

export default FilterItem;
