import { makeStyles, Theme } from "@material-ui/core";
import React, { Fragment } from "react";
import TagFilterItem from "./TagFilterItem";
import { TagFilterItemType } from "./TagFilterItem.types";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: 0,
    paddingRight: 10,
    paddingBottom: 10,
    marginTop: -6,
  },
}));

interface ListTagFilterItemProps {
  data?: TagFilterItemType[];
  handleClickTagFilter: (filterName: string) => void;
  handleDeleteTagFilter: (filterType: string) => void;
}

const ListTagFilterItem = (props: ListTagFilterItemProps) => {
  const { data, handleClickTagFilter, handleDeleteTagFilter } = props;
  const classes = useStyles();

  if (data && data.length > 0) {
    return (
      <div className={classes.root}>
        {React.Children.toArray(
          data.map((item) => (
            <TagFilterItem
              label={item.label}
              filterType={item.filterType}
              filterName={item.filterName}
              handleClick={handleClickTagFilter}
              handleDelete={handleDeleteTagFilter}
            />
          ))
        )}
      </div>
    );
  }
  return <Fragment></Fragment>;
};

export default ListTagFilterItem;
