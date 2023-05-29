import { Box, Grid, Typography, WithStyles, withStyles } from "@material-ui/core";
import React from "react";
import { ConnectedProps, connect } from "react-redux";
import { AppState } from "store/store";
import styles from "./CreateItem.styles";
import Paper from "components/Paper/Paper";
import NumberInputTextField from "components/NumberInput/NumberInputTextField";
import TextField from "components/TextField";
export interface CreateItemProps extends WithStyles<typeof styles> {

}
const CreateItem = (props: CreateItemProps & PropsFromRedux) => {
    const { classes, authState } = props;
    return (
        <>
            <Box className={classes.container}>
                <Grid container xs={12} spacing={2}>
                    <Grid item xs={8}>
                        <Paper className={classes.wrapperBoxInfo}>
                            <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
                                Thông tin nguyên liệu
                            </Typography>
                            <Box className={classes.boxContentPaper}>

                            </Box>
                        </Paper>
                        <Paper className={classes.wrapperBoxInfo}>
                            <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
                                Thông tin variant
                            </Typography>
                            <Box className={classes.boxContentPaper}></Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper className={classes.wrapperBoxInfo}>
                            <Typography variant="h6" style={{ padding: "12px 24px 16px" }}>
                                Thông tin mặt hàng
                            </Typography>
                            <Box className={classes.boxContentPaper}>
                                <Grid xs={12}>
                                    <TextField label="Tên mặt hàng" placeholder="Nhập tên mặt hàng" required fullWidth />
                                    <NumberInputTextField
                                        label="Giảm giá mặt hàng"
                                        placeholder="Nhập giá trị giảm giá"
                                        style={{marginTop: "16px"}}
                                        onChange={(e) => {

                                        }}
                                        fullWidth
                                        name={"discount"} />
                                </Grid>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

const mapStateToProps = (state: AppState) => ({
    menuState: state.menu,
    authState: state.auth,
});
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connect(mapStateToProps, {})(withStyles(styles)(CreateItem));

