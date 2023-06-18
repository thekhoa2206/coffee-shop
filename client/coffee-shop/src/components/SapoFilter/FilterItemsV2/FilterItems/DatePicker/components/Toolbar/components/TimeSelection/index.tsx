import { Box, MenuItem, Typography } from "@material-ui/core";
import { ClassNameMap } from "@material-ui/styles";
import React from "react";
import clsx from "clsx";
import ClockIcon from "components/SVG/ClockIcon";
import Select from "components/Select/Index";

interface Props {
  onChange: (hours: number, minutes: number) => void;
  classes: ClassNameMap<"clockIcon" | "box" | "boxCenter">;
  hours: number;
  minutes: number;
}

const TimeSelection = React.memo(function Component(props: Props) {
  const { onChange, classes, hours, minutes } = props;

  let hoursElement: JSX.Element[] = [];
  let minsElement: JSX.Element[] = [];
  for (let i = 0; i < 24; i++) {
    let text: string = "" + i;
    if (i < 10) {
      text = "0" + text;
    }
    hoursElement.push(
      <MenuItem key={`hour-${i}`} value={i}>
        {text}
      </MenuItem>
    );
  }
  for (let i = 0; i < 60; i++) {
    let text: string = "" + i;
    if (i < 10) {
      text = "0" + text;
    }
    minsElement.push(
      <MenuItem key={`min-${i}`} value={i}>
        {text}
      </MenuItem>
    );
  }

  const maxHeightSelect = 38 * 5;
  return (
    <Box className={clsx(classes.box, classes.boxCenter, "selectTime")}>
      <ClockIcon className={classes.clockIcon} />
      <Box style={{ marginLeft: 18 }}>
        <Select
          style={{ width: 56 }}
          value={hours}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
            onChange(event.target.value as number, minutes);
          }}
          size="small"
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: maxHeightSelect,
                marginTop: 4,
              },
            },
            getContentAnchorEl: null,
            anchorPosition: { top: 245, left: 92 },
            anchorReference: "anchorPosition",
            disablePortal: true,
          }}
        >
          {hoursElement}
        </Select>
      </Box>
      <Typography style={{ margin: "0 6px" }}>:</Typography>
      <Box>
        <Select
          value={minutes}
          style={{ width: 56 }}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
            onChange(hours, event.target.value as number);
          }}
          size="small"
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: maxHeightSelect,
                marginTop: 4,
              },
            },
            getContentAnchorEl: null,
            anchorPosition: { top: 245, left: 180 },
            anchorReference: "anchorPosition",
            disablePortal: true,
          }}
        >
          {minsElement}
        </Select>
      </Box>
    </Box>
  );
});

export default TimeSelection;
