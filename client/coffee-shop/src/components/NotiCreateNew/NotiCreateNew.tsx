import { Box, Typography } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { WithStyles, withStyles } from "@material-ui/styles";
import Button from "components/Button";
import { CheckCircleOutlineIcon } from "components/SVG";
import React, { Fragment, memo } from "react";
import styles from "./NotiCreateNew.styles";

interface NotiCreateNewProps {
  label?: string;
  creatableText?: string;
  style?: React.CSSProperties;
  ContentComponent?: any;
  CreatableComponent?: any;
  href?: string;
  onClickCreatable?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const NotiCreateNew = memo((props: NotiCreateNewProps & WithStyles<typeof styles>) => {
  const { classes, label, creatableText, onClickCreatable, style, ContentComponent, CreatableComponent, href } = props;

  return (
    <Box className={classes.root} style={style}>
      {ContentComponent || (
        <Fragment>
          <Box className="left">
            <Box className={classes.label}>
              <CheckCircleOutlineIcon style={{ color: "#0FD186", marginRight: 8, fontSize: "24px" }} />
              <Typography variant="h4" component="span">
                {label}
              </Typography>
            </Box>
          </Box>
          <Box className="right">
            {CreatableComponent || (
              <Button
                className={classes.btnCreate}
                href={href}
                onClick={(e) => onClickCreatable?.(e)}
                startIcon={<AddCircleOutlineIcon color="primary" style={{ fontSize: "24px" }} />}
                color="primary"
              >
                {creatableText}
              </Button>
            )}
          </Box>
        </Fragment>
      )}
    </Box>
  );
});

NotiCreateNew.displayName = "NotiCreateNew";
export default withStyles(styles)(NotiCreateNew);
