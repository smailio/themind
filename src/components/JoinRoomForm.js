import React, { Component } from "react";
import Row from "./Row";
import Input from "./Input";
import CenteredPage from "./CenteredPage";
import JoinRoomButton from "./JoinRoomButton";
import { enterRoom, joinRoom } from "../api/room";
import { withRouter } from "react-router-dom";
import connect from "react-redux/es/connect/connect";

class JoinRoomForm extends Component {
  componentDidMount() {
    console.log("JoinRoomForm componentDidMount call enterRoom");
    this.props.enterRoom();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.uid !== this.props.uid) {
      console.log("JoinRoomForm componentDidUpdate call enterRoom");
      this.props.enterRoom();
    }
  }

  render() {
    const {
      userName,
      joinRoom,
      saveUserName,
      nameAlreadyExistsWarning,
      errorWarning
    } = this.props;
    return (
      <CenteredPage columnar>
        <Row full centered style={{ marginBottom: 24 }}>
          <Row width={308}>
            <Input
              placeholder="Your name"
              name="userName"
              value={userName}
              onChange={e => saveUserName(e.target.value)}
            />
          </Row>
          {nameAlreadyExistsWarning && (
            <Row width={308} style={{ color: "tomato" }}>
              A player already exists with this name in this room
            </Row>
          )}
          {errorWarning && (
            <Row width={308} style={{ color: "tomato" }}>
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

const makeJoinRoomHandler = (
  roomId,
  userName,
  uid,
  history,
  dispatch
) => () => {
  joinRoom(roomId, uid, userName).then(({ type }) => {
    if (type === "SHOW_ROOM") {
      console.log("JoinRoomForm joinRoom success rediret to Room " + roomId);
      history.push("/" + roomId);
    } else if (type === "NAME_ALREADY_EXISTS") {
      console.log("JoinRoomForm joinRoom response NAME_ALREADY_EXISTS");
      dispatch({ type, roomId });
    } else {
      console.log("JoinRoomForm joinRoom response " + type);
      dispatch({ type });
    }
  });
};

export default withRouter(
  connect(
    state => ({ ...state.form, uid: state.user.uid }),
    dispatch => ({
      dispatch
    }),
    (stateProps, dispatchProps, props) => {
      const roomId = props.match.params.roomId;
      const { userName, uid } = stateProps;
      const { history } = props;
      const { dispatch } = dispatchProps;
      return {
        enterRoom: () => {
          enterRoom(roomId, uid).then(({ type }) => {
            if (type === "SHOW_ROOM") {
              console.log(
                "JoinRoomForm enterRoom success REDIRECT TO ROOM" + roomId
              );
              history.push("/" + roomId);
            }
          });
        },
        joinRoom: makeJoinRoomHandler(roomId, userName, uid, history, dispatch),
        saveUserName: userName =>
          dispatch({
            type: "SET_FORM",
            form: { userName, roomName: stateProps.roomName }
          })
      };
    }
  )(JoinRoomForm)
);
