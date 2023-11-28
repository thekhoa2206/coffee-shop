
import { Box, Typography } from "@material-ui/core";
import React from "react";

export type BoxTotalProps = {

}

export const BoxTotal = (props: BoxTotalProps) => {

    return (
        <Box style={{ maxHeight: 1000, height: 100 }}>
            <Box style={{ padding: 10 }}>
                <Typography style={{ fontWeight: 500 }}>Tổng sản phẩm</Typography>
            </Box>
            <Box style={{ padding: 10 }}>
                <Typography style={{ fontWeight: 500 }}>Tổng tiền</Typography>
            </Box>
        </Box>
    );
};
