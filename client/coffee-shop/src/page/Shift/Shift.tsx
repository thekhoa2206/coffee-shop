import { Box, Typography, withStyles } from "@material-ui/core";
import useQueryParams from "hocs/useQueryParams";
import React, { useEffect, useState } from "react";
import { ConnectedProps, connect } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Frame, Modal, TextContainer, Toast } from '@shopify/polaris';
import { AppState } from "store/store";
import {
    StocktakingReponse,
    StoctakingFilterRequest,
} from "services/StocktakingService/type";
import { ReceiptProps } from "page/Stocktaking/Receipt/Receipt.type";
import ShiftService, { ShiftResponse } from "services/ShiftService";
import styles from "page/Items/Items.styles";
import SnackbarUtils from "utilities/SnackbarUtilsConfigurator";
import { formatDateUTCToLocalDateString, formatMoney, getMessageError } from "utilities";
import Paper from '@mui/material/Paper';
import { right } from "@popperjs/core";
const Shift = (props: ReceiptProps & PropsFromRedux) => {
    const { classes, authState, type } = props;
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<ShiftResponse>();
    const [active, setActive] = useState(false);
    const toggleModal = () => { setActive(!active) };
    const history = useHistory();
    useEffect(() => {
        initData();
    }, []);

    const initData = async () => {
        let res = await ShiftService.getById(authState.user.id);
        try {
            if (res.data) {
                setData(res.data);
            }
        } catch (error) {
            toggleModal;
        }
        setLoading(false);
    };
    const addData = async () => {
        let res = await ShiftService.create(authState.user.id);
        try {
            if (res.data) {
                setData(res.data);
            }
        } catch (error) {
            SnackbarUtils.error(getMessageError(error));
        }
        setLoading(false);
    };
    return (
        <>
            <Box className={classes.container}>
               {data? 
               <Paper elevation={3} style={{ width: "90%", height: "80vh", marginTop: 35, marginLeft: 70, background: "rgba(255, 255, 255, 1)" }}>
                    <Box display="flex" padding="15px">
                        <Box>
                            <Box style={{ display: "flex" }}>
                                <Typography variant="h5" >Nhân viên ca: </Typography>
                                <Typography variant="h5" style={{ marginLeft: 15 }}>{data?.userStart}</Typography>
                            </Box>
                            <Box style={{ display: "flex" }}>
                                <Typography variant="h5">Doanh thu: </Typography>
                                <Typography variant="h5" style={{ marginLeft: 15 }}>{formatMoney(data?.shiftTurnover ||0)}đ</Typography>
                            </Box>
                           
                        </Box>
                        <Box style={{position:"absolute",right : 0,marginRight:110}}>
                            <Box style={{ display: "flex" }}>
                                <Typography variant="h5">Ngày tạo ca: </Typography>
                                <Typography variant="h5" style={{ marginLeft: 15 }}> {formatDateUTCToLocalDateString(
                                                            data.createdOn,
                                                            false,
                                                            "DD/MM/YYYY"
                                                        )}</Typography>
                            </Box>
                            <Box style={{ display: "flex" }}>
                                <Typography variant="h5">Thời gian tạo ca: </Typography>
                                <Typography variant="h5" style={{ marginLeft: 15 }}> {formatDateUTCToLocalDateString(
                                                            data.createdOn,
                                                            false,
                                                            " HH:mm"
                                                        )}</Typography>
                            </Box>
                        </Box>
                    </Box>
                   <Box display="flex" padding="10px">
                    <Box style={{border: "2px solid rgba(235, 235, 235, 1)",borderRadius: "8px",height:"60vh",width:"30%",marginLeft:24}}>
                    <Typography variant="h5" align="center" >
                                    Đơn hàng
                    </Typography>
                    <Box style={{borderTop :"2px solid rgba(235, 235, 235, 1)",borderBottom :"2px solid rgba(235, 235, 235, 1)",padding:25,height:180}}>
                        <Box display="flex" >
                            <Typography > Số lượng: </Typography>
                            <Typography> {data.totalOrder} </Typography>
                        </Box>
                        <Box display="flex">
                            <Typography> Tổng tiền: </Typography>
                            <Typography> {formatMoney(data.moneyOrder ||0 )}đ </Typography>
                        </Box>
                    </Box>
                    </Box>
                    <Box style={{border: "2px solid rgba(235, 235, 235, 1)",borderRadius: "8px",height:"60vh",width:"30%",marginLeft:24}}>
                    </Box>
                    <Box style={{border: "2px solid rgba(235, 235, 235, 1)",borderRadius: "8px",height:"60vh",width:"30%",marginLeft:24}}>
                    </Box>
                   </Box>
                </Paper>:null}
            </Box>
            {active ?
                <Frame>
                    <div style={{ height: '500px' }}>
                        <Modal
                            open={active}
                            onClose={toggleModal}
                            title="Chưa có ca mở! Hãy tiến hành mở ca để bắt đầu ca làm việc."
                            primaryAction={{
                                destructive: true,
                                content: 'Huỷ',
                                onAction: toggleModal,
                            }}
                            secondaryActions={[
                                {
                                    content: 'Mở ca',
                                    onAction: addData,
                                },

                            ]}
                        >
                        </Modal>
                    </div>
                </Frame> : null
            }

        </>
    );

};

const mapStateToProps = (state: AppState) => ({
    menuState: state.menu,
    authState: state.auth,
});
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connect(mapStateToProps, {})(withStyles(styles)(Shift));
