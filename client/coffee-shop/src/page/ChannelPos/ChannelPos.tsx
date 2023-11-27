import { AppState } from "store/store";
import { ChannelPosProps } from "./ChannelPos.type";
import { ConnectedProps, connect } from "react-redux";
import styles from "./ChannelPos.styles";
import { Box, ButtonGroup, IconButton, Menu, MenuItem, RootRef, Select, Typography, withStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Table from "../../images/table.png"
import Image from "components/Image";
import TableService, { TableFilterRequest, TableResponse } from "services/TableService";
import { colorBlue, colorGreen, colorInk, colorRedWarning } from "theme/palette";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Popover from "components/Popover";
import Popper from "components/Popper/PopperBase";
import { DialogCreateOrder } from "./components/DialogCreateOrder/DialogCreateOrder";
import Checkbox from "components/Checkbox";
import Button from "components/Button";
const ChannelPos = (props: ChannelPosProps & PropsFromRedux) => {
    const [filter, setFilter] = useState<TableFilterRequest>({
        page: 1,
        limit: 20
    });
    const [openCreateOrder, setOpenCreateOrder] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [openButton, setOpenButton] = useState(false);
    const [selected, setSelected] = useState<TableResponse[]>([]);
    const classes = props.classes;
    const [tables, setTables] = useState<TableResponse[]>([]);
    useEffect(() => {
        initData();
    }, []);

    const initData = async () => {
        let res = await TableService.filter(filter);
        if (res.data) {
            setTables(res.data?.data || []);
        }
    }
    const genStatus = (status: number) => {
        let statusString;
        switch (status) {
            case 1:
                statusString = "Đang sử dụng"
                break;
            case 2:
                statusString = "Bàn không hoạt động"
                break;
            case 3:
                statusString = "Bàn trống"
                break;
            default:
                statusString = "Bàn không hoạt động"
                break;
        }
        return statusString;
    }

    const genColor = (status: number) => {
        let color = "";
        switch (status) {
            case 1:
                color = colorBlue.primary["main"]
                break;
            case 2:
                color = colorRedWarning.primary["main"]
                break;
            case 3:
                color = colorGreen.primary["main"];
                break;
            default:
                color = colorRedWarning.primary["main"]
                break;
        }
        return color;
    }
    const handleChangeSelected = (item: TableResponse) => {
        var oldTable = selected.filter((t) => t.id === item.id);
        if (oldTable) {
            setSelected(selected.filter((t) => t.id !== item.id))
        } else {
            setSelected([...selected, item])
        }
    }
    return (
        <Box style={{width: "95%"}}>
            <Box style={{width: "95%", marginTop: 10}}>                
                <Button variant="contained" color="primary" style={{float: "right"}}
                onClick={() => {setOpenCreateOrder(true)}}
                >Tạo đơn hàng
                </Button>
            </Box>
            <Box style={{ width: "95%", margin: "auto", top: "20px", display: "flex", flexWrap: "wrap", marginTop: 20 }}>
                {tables.map((item, index) => (
                    <Box style={{ width: 120, textAlign: "center", cursor: "pointer", margin: 10 }} key={index}
                        onClick={(event: React.MouseEvent<HTMLElement>) => {
                            handleChangeSelected(item);
                            setOpenButton(!openButton);
                            setAnchorEl(event.currentTarget);
                        }}
                        aria-describedby={item.id}
                        id={item.id}
                    >
                        <Checkbox />
                        <Image src={Table} style={{ width: 100 }} />
                        <Box style={{ display: "flex", width: 100, margin: "auto" }}>
                            <Box style={{ width: 10, height: 10, background: genColor(item.status), marginTop: 5, borderRadius: 50 }}></Box>
                            <Typography style={{ fontSize: 10, marginLeft: 5 }}>({genStatus(item.status)})</Typography>
                        </Box>
                        <Typography>{item.name}</Typography>

                    </Box>
                ))}
                <DialogCreateOrder tables={selected} open={openCreateOrder} onClose={() => { setOpenCreateOrder(false) }} />
            </Box>
        </Box>
    );
};

const mapStateToProps = (state: AppState) => ({
    menuState: state.menu,
    authState: state.auth,
});
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connect(mapStateToProps, {})(withStyles(styles)(ChannelPos));