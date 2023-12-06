import { Box, Grid, withStyles } from "@material-ui/core";
import React from "react";
import { ConnectedProps, connect } from "react-redux";
import { AppState } from "store/store";
import useStyles from "./Dashboard.styles";
import { ReportOrderProps } from "./Dashboard.types";
import DashboardRevenueComponent from "./components/DashboardRevenue/DashboardRevenue.component";
import SockJS from "sockjs-client";
import ChatComponent from "./ChatComponent/ChatComponent";

const ReportOrder = (props: ReportOrderProps & PropsFromRedux) => {
  const { classes, authState } = props;

  var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');
  var stompClient : any= null

var username = "";
  const connect = (event: any) => {
  
    var socket = new SockJS('/ws');
        stompClient = stompClient.over(socket);
        stompClient.connect({}, onConnected, onError);
    event.preventDefault();
  }

  const onConnected = () => {
    // Subscribe to the Public Topic
    stompClient.subscribe('/topic/public', onMessageReceived);
  
    // Tell your username to the server
    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
    )
  
  }

  const onMessageReceived = (payload: any) => {

  }
  function onError(error:any) {
  }
  return (
    <Box>
      <Box
      style={{ margin: "auto", marginTop: 30, width: "90%",marginBottom:24 ,height:"100%"}}
      >
<DashboardRevenueComponent/>
<Box>

</Box>
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
export default connect(mapStateToProps, {})(withStyles(useStyles)(ReportOrder));
