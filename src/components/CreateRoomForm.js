import React from "react";
import Input from "./Input";
import CenteredPage from "./CenteredPage";
import Row from "./Row";
import CreateRoomButton from "./BlueButton";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { createRoom } from "../api/room";

function createAndSetUpRoom(
  uid,
  userName,
  roomName,
  history,
  setCurrentRoomId
) {
  createRoom(uid, userName, roomName).then(roomId => {
    history.push(roomId);
    setCurrentRoomId(roomId);
  });
}

let CreateRoomForm = ({
  userName,
  roomName,
  history,
  uid,
  saveForm,
  setCurrentRoomId
}) => (
  <CenteredPage columnar>
    <Row full centered style={{ marginBottom: 24 }}>
      <Row width={308}>
        <Input
          placeholder="Room's name"
          name="roomName"
          value={roomName}
          onChange={e => saveForm(e.target.value, userName)}
        />
      </Row>
    </Row>
    {/*<Row full centered style={{ marginBottom: 24 }}>*/}
    {/*<Row width={308}>*/}
    {/*<Input*/}
    {/*placeholder="Your name"*/}
    {/*name="userName"*/}
    {/*value={userName}*/}
    {/*onChange={e => saveForm(roomName, e.target.value)}*/}
    {/*/>*/}
    {/*</Row>*/}
    {/*</Row>*/}
    <Row full centered>
      {/*<div style={{ width: 150, padding: 4 }}>*/}
      {/*<JoinRoomButton onClick={joinRoom.bind(null, roomName, userName)}>*/}
      {/*Join room*/}
      {/*</JoinRoomButton>*/}
      {/*</div>*/}
      <div style={{ width: 150, padding: 4 }}>
        <CreateRoomButton
          onClick={createAndSetUpRoom.bind(
            null,
            uid,
            userName,
            roomName,
            history,
            setCurrentRoomId
          )}
        >
          Create room
        </CreateRoomButton>
      </div>
    </Row>
  </CenteredPage>
);

export default withRouter(
  connect(
    state => ({ ...state.form, uid: state.user.uid }),
    dispatch => ({
      saveForm: (roomName, userName) =>
        dispatch({ type: "SET_FORM", form: { userName, roomName } }),
      setCurrentRoomId: roomId => dispatch({ type: "SET_ROOM_ID", roomId })
    })
  )(CreateRoomForm)
);
