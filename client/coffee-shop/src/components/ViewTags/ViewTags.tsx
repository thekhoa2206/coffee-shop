import React, { useEffect, useRef, useState } from "react";
import { Grid, Typography } from "@material-ui/core";
import Chip from "components/Chip";
import { makeStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core/styles";
import PopperBase from "components/Popper/PopperBase";
import clsx from "clsx";

interface ViewTagsProps {
  tags: string[];
  limitTags?: number;
  classRoot?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: "5px -4px",
    alignItems: "center",
    "& > .MuiGrid-item": {
      padding: "2px 4px",
    },
  },
  chipTag: {
    backgroundColor: "#D9EDFF",
    borderRadius: 20,
    padding: 4,
    height: 28,
    fontSize: "1rem",
    "&:first-child": {
      marginLeft: 0,
    },
    "&:last-child": {
      marginRight: 0,
    },
    maxWidth: "100%",
  },
  wrapperTag: {
    maxWidth: "100%",
  },
}));
const ViewTags = (props: ViewTagsProps) => {
  const { tags, limitTags = 2, classRoot } = props;
  const [tagsShow, setTagsShow] = useState(tags.slice(0, limitTags));
  const [tagsHidden, setTagsHidden] = useState<string[]>([]);
  const classes = useStyles();
  const tagsHiddenRef = useRef(null);
  const [openTagsHiddenPopper, setOpenTagsHiddenPopper] = useState(false);
  useEffect(() => {
    let tagsShow = tags.slice(0, limitTags);
    setTagsShow(tagsShow);
    let tagsHidden = tags.length - tagsShow.length;
    if (tagsHidden > 0) {
      setTagsHidden(tags.slice(limitTags));
    }
  }, [tags]);

  return (
    <Grid container className={clsx(classes.root, classRoot)} spacing={1}>
      {tagsShow.map((item) => (
        <Grid key={item} item classes={{ root: classes.wrapperTag }}>
          <Chip label={item} classes={{ root: classes.chipTag }} />
        </Grid>
      ))}
      {tagsHidden.length > 0 && (
        <Typography
          ref={tagsHiddenRef}
          style={{ color: "#747C87", marginLeft: 2, height: 28, lineHeight: "28px" }}
          onMouseEnter={() => setOpenTagsHiddenPopper(true)}
          // onMouseLeave={() => setOpenTagsHiddenPopper(false)}
        >
          +{tagsHidden.length}
        </Typography>
      )}
      <PopperBase
        referenceElement={tagsHiddenRef.current}
        width={256}
        open={openTagsHiddenPopper}
        ignoreEventCloseInRootRef={true}
        onClose={() => setOpenTagsHiddenPopper(false)}
      >
        <Grid
          container
          style={{ margin: "5px 4px" }}
          className={classes.root}
          onMouseEnter={() => setOpenTagsHiddenPopper(true)}
          onMouseLeave={() => setOpenTagsHiddenPopper(false)}
        >
          {tagsHidden.map((item) => (
            <Grid key={item} item classes={{ root: classes.wrapperTag }} style={{ maxWidth: "calc(100% - 8px)" }}>
              <Chip label={item} classes={{ root: classes.chipTag }} style={{ maxWidth: "100%" }} />
            </Grid>
          ))}
        </Grid>
      </PopperBase>
    </Grid>
  );
};

export default ViewTags;
