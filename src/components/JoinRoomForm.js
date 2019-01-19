import React, { Component } from "react";
import Row from "./Row";
import Input from "./Input";
import CenteredPage from "./CenteredPage";
import JoinRoomButton from "./JoinRoomButton";
import { withRouter } from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import * as actions from "../actions";
import Typography from "@material-ui/core/Typography";
import Loader from "./Loader";
import { currentPlayerIsInRoom } from "../store";

class JoinRoomForm extends Component {
  componentDidMount() {
    console.log("JoinRoomForm componentDidMount call enterRoom");
    this.props.enterRoom();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.uid !== this.props.uid || this.props.alreadyInRoom) {
      console.log("JoinRoomForm componentDidUpdate call enterRoom");
      this.props.enterRoom().then(exitRoom => {
        console.log("save exitRoom function in this", exitRoom, this);
        this.exitRoom = exitRoom;
      });
    }
  }

  componentWillUnmount() {
    this.exitRoom();
  }

  render() {
    console.log("JoinRoomForm render", this.props);
    const {
      userName,
      joinRoom,
      saveUserName,
      nameAlreadyExists,
      userNameRequired,
      roomIsFull,
      errorWarning,
      userNameTooLong,
      showJoinRoomSpinner
    } = this.props;
    if (!this.props.roomLoaded) {
      return <Loader />;
    } else if (this.props.roomNotFound) {
      return (
        <CenteredPage>
          <Typography variant="h5">
            It seems that this room doesn't exists
          </Typography>
        </CenteredPage>
      );
    } else if (this.props.gameStarted) {
      return (
        <CenteredPage>
          <Typography variant="h5">Can't join this room anymore !</Typography>
        </CenteredPage>
      );
    } else if (showJoinRoomSpinner) {
      return <Loader />;
    }
    return (
      <CenteredPage columnar>
        <Row centered style={{ marginBottom: 24 }}>
          <Row full>
            <Input
              placeholder="Your name"
              name="userName"
              value={userName}
              onChange={e => saveUserName(e.target.value)}
            />
          </Row>
          {nameAlreadyExists && (
            <Row full>
              <Typography style={{ color: "tomato" }}>
                A player already exists with this name in this room
              </Typography>
            </Row>
          )}
          {roomIsFull && (
            <Row full>
              <Typography style={{ color: "tomato" }}>
                This room is full{" "}
                <span role={"img"} aria-label="sad face">
                  😢
                </span>
              </Typography>
            </Row>
          )}
          {userNameTooLong && (
            <Row full>
              <Typography style={{ color: "tomato" }}>
                Name can't be longer than 15 characters
              </Typography>
            </Row>
          )}
          {userNameRequired && (
            <Row full>
              <Typography style={{ color: "tomato" }}>
                Enter a user name.
              </Typography>
            </Row>
          )}
          {errorWarning && (
            <Row full style={{ color: "tomato" }}>
              Something wrong happened, please try again.
            </Row>
          )}
        </Row>
        <Row full centered>
          <div style={{ width: 150, padding: 4 }}>
            <JoinRoomButton onClick={joinRoom}>Join room</JoinRoomButton>
          </div>
        </Row>
      </CenteredPage>
    );
  }
}

export default withRouter(
  connect(
    state => ({
      ...state.form,
      uid: state.user.uid,
      gameStarted: state.currentRoom.gameStarted,
      alreadyInRoom: currentPlayerIsInRoom(state),
      roomLoaded: state.currentRoom.roomLoaded,
      roomNotFound: state.currentRoom.roomNotFound,
      showJoinRoomSpinner: state.showJoinRoomSpinner
    }),
    dispatch => ({
      dispatch
    }),
    (stateProps, dispatchProps, props) => {
      const roomId = props.match.params.roomId;
      const { userName, uid, ...otherStateProps } = stateProps;
      const { history } = props;
      const { dispatch } = dispatchProps;
      return {
        ...otherStateProps,
        enterRoom: () => actions.enterRoom(roomId, uid)(dispatch, history),
        joinRoom: () =>
          actions.joinRoom(roomId, uid, userName)(dispatch, history),
        saveUserName: userName =>
          dispatch({
            type: "SET_FORM",
            form: { userName, roomName: stateProps.roomName }
          })
      };
    }
  )(JoinRoomForm)
);
