import React from 'react';
import Input from './Input';
import CenteredPage from './CenteredPage';
import Row from './Row';
import CreateRoomButton from './CreateRoomButton';
import JoinRoomButton from './JoinRoomButton';
import { withRouter } from 'react-router-dom';
import { db } from '../initFirebase';
import { connect } from 'react-redux';

function createRoom(uid, userName, roomName) {
  console.log('create room name : ', roomName, 'user : ', userName, 'uid', uid);
  // TODO if not uid ask to try later
  return db
    .collection('rooms')
    .add(newRoom(userName, roomName, uid))
    .then(docRef => {
      console.log('docRef', docRef, 'id', docRef.id, 'get', docRef.get());
      return docRef.id;
    });
}

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

function newRoom(userName, roomName, uid) {
  return {
    roomName,
    creatorUid: uid,
    players: [{ userName, uid }]
  };
}

function joinRoom(roomName, userName) {
  console.log('join room name : ', roomName, 'user : ', userName);
}

let RoomForm = ({
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
    <Row full centered style={{ marginBottom: 24 }}>
      <Row width={308}>
        <Input
          placeholder="Your name"
          name="userName"
          value={userName}
          onChange={e => saveForm(roomName, e.target.value)}
        />
      </Row>
    </Row>
    <Row full centered>
      <div style={{ width: 150, padding: 4 }}>
        <JoinRoomButton onClick={joinRoom.bind(null, roomName, userName)}>
          Join room
        </JoinRoomButton>
      </div>
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
        dispatch({ type: 'SET_FORM', form: { userName, roomName } }),
      setCurrentRoomId: roomId => dispatch({ type: 'SET_ROOM_ID', roomId })
    })
  )(RoomForm)
);
