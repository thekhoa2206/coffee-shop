
import { Box, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import _ from "lodash";
import { useOrderTableStore } from "page/ChannelPos/store";
import React from "react";
import { formatMoney } from "utilities";

export type BoxTotalProps = {

}

export const BoxTotal = (props: BoxTotalProps) => {
    const { lineItems, total, order } = useOrderTableStore();

    const totalQuantity = () => {
        var total = 0;
        if(lineItems && lineItems.length > 0){
            lineItems.map((i) => (total += i.quantity));
        }
        return total;
    }

    const totalPrice = () => {
        var total = 0;
        if(lineItems && lineItems.length > 0){
            lineItems.map((i) => (total += i.quantity*i.price));
        }
        return total;
    }
    return (
        <Box style={{ maxHeight: 1000, height: 100 }}>
            <Box style={{ padding: 10 }}>
                <Typography style={{ fontWeight: 500 }}>Tổng sản phẩm</Typography>
                <Box>
                        <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell width="70%">Tên</TableCell>
                                <TableCell>SL</TableCell>
                                <TableCell  align="right">Giá</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lineItems && lineItems.map((item, index) => (
                                <TableRow>
                                    <TableCell><Typography>{item.name}</Typography></TableCell>
                                    <TableCell><Typography>{item.quantity}</Typography></TableCell>
                                    <TableCell align="right"><Typography>{formatMoney(item.price)}</Typography></TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                    <TableCell><Typography></Typography></TableCell>
                                    <TableCell><Typography></Typography>{totalQuantity()}</TableCell>
                                    <TableCell align="right"><Typography>{formatMoney(totalPrice())}</Typography></TableCell>
                            </TableRow>
                         </TableBody>
                        </Table>
                   
                </Box>
            </Box>
            <Box style={{ padding: 10 }}>
                <Typography style={{ fontWeight: 500 }}>Tổng tiền</Typography>
            </Box>
        </Box>
    );
};
