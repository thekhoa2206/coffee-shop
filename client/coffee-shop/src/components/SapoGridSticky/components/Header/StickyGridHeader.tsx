import { Box, Typography, WithStyles } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { HeadCell } from "components/SapoGridSticky/SapoGridSticky.types";
import TooltipComponent from "components/Tooltip";
import { isString } from "lodash";
import React, { memo } from "react";
import { DEFAULT_HEAD_HEIGHT } from "../../SapoGridSticky.constants";
import style from "./StickyGridHeader.style";
import StickyGridHeaderProps from "./StickyGridHeader.type";
import clsx from "clsx";

const StickyGridHeader = memo((props: StickyGridHeaderProps & WithStyles<typeof style>) => {
  const { classes, cells, sticky, top } = props;

  return (
    <Box className={clsx(classes.root, "TableHead", { [classes.sticky]: sticky })} style={{ top: top }}>
      {cells.map((row: any, idx: number) => {
        let widthFormLeft = 0;
        return (
          <Box key={idx} className="row">
            {row.childrens &&
              row.childrens.map((col: HeadCell, idx: number) => {
                if (col.type === "rowSpan") {
                  if (!col.display) {
                    return null;
                  }
                  return (
                    <Box key={idx} className="col">
                      {col.childrens?.map((row: any, rowIdx: number) => {
                        if (col.type === "rowSpan") {
                          return (
                            <Box key={rowIdx} className={`row row-sub`}>
                              {row.childrens?.map((subCol: HeadCell, subColIdx: number) => {
                                if (!subCol.display) {
                                  return;
                                }

                                const width = subCol.width || 92;
                                const height = subCol.rowSpan * DEFAULT_HEAD_HEIGHT;
                                widthFormLeft += width;
                                const className = clsx(classes.cell, "cell cell-sub", subCol.classname);

                                if (subCol.template && isString(subCol.template)) {
                                  return (
                                    <Box
                                      key={subColIdx}
                                      className={className}
                                      style={{
                                        width: width,
                                        height: height,
                                        justifyContent: subCol.align || "left",
                                        ...subCol.style,
                                      }}
                                    >
                                      <TooltipComponent arrow title={subCol.template}>
                                        <Typography
                                          noWrap
                                          variant={"subtitle1"}
                                          className="content"
                                          align={subCol.align || "left"}
                                        >
                                          {subCol.template}
                                        </Typography>
                                      </TooltipComponent>
                                    </Box>
                                  );
                                } else {
                                  return (
                                    <Box
                                      key={subColIdx}
                                      className={className}
                                      style={{
                                        width: width,
                                        height: height,
                                        justifyContent: subCol.align || "left",
                                        ...subCol.style,
                                      }}
                                    >
                                      {subCol.template}
                                    </Box>
                                  );
                                }
                              })}
                            </Box>
                          );
                        } else {
                          if (!col.display) {
                            return;
                          }
                          const height = col.rowSpan * DEFAULT_HEAD_HEIGHT;
                          const className = clsx(classes.cell, "cell cell-sub", col.classname);

                          if (col.template && isString(col.template)) {
                            return (
                              <Box
                                key={idx}
                                className={className}
                                style={{
                                  width: "100%",
                                  height: height,
                                  justifyContent: col.align || "left",
                                  ...col.style,
                                }}
                              >
                                <TooltipComponent arrow title={col.template}>
                                  <Typography
                                    variant={"subtitle1"}
                                    noWrap
                                    className="content"
                                    align={col.align || "left"}
                                  >
                                    {col.template}
                                  </Typography>
                                </TooltipComponent>
                              </Box>
                            );
                          } else {
                            return (
                              <Box
                                key={idx}
                                className={className}
                                style={{
                                  width: "100%",
                                  height: height,
                                  justifyContent: col.align || "left",
                                  ...col.style,
                                }}
                              >
                                {col.template}
                              </Box>
                            );
                          }
                        }
                      })}
                    </Box>
                  );
                } else {
                  if (!col.display) {
                    return null;
                  }
                  const className = clsx(classes.cell, "col", { sticky: col.sticky }, col.sticky, col.classname);
                  const width = col.width || 92;
                  const height = col.rowSpan * DEFAULT_HEAD_HEIGHT;

                  let left: string = "none";
                  switch (col.sticky) {
                    case "left":
                      left = `${widthFormLeft}px`;
                      break;
                    default:
                      break;
                  }
                  widthFormLeft += width;

                  if (col.template && isString(col.template)) {
                    return (
                      <Box
                        key={idx}
                        className={className}
                        style={{
                          width: width,
                          height: height,
                          left: left,
                          boxShadow: "1px 0px #e8eaeb",
                          justifyContent: col.align || "left",
                          ...col.style,
                        }}
                      >
                        <TooltipComponent arrow title={col.template}>
                          <Typography variant={"subtitle1"} noWrap className="content" align={col.align || "left"}>
                            {col.template}
                          </Typography>
                        </TooltipComponent>
                      </Box>
                    );
                  } else {
                    return (
                      <Box
                        key={idx}
                        className={className}
                        style={{
                          width: width,
                          height: height,
                          left: left,
                          boxShadow: "1px 0px #e8eaeb",
                          justifyContent: col.align || "left",
                          ...col.style,
                        }}
                      >
                        {col.template}
                      </Box>
                    );
                  }
                }
              })}
            {/* End ROW */}
          </Box>
        );
      })}
    </Box>
  );
});

StickyGridHeader.displayName = "StickyGridHeader";
export default withStyles(style)(StickyGridHeader);
