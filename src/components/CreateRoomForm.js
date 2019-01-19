import React from "react";
import Input from "./Input";
import CenteredPage from "./CenteredPage";
import Row from "./Row";
import CreateRoomButton from "./RedButton";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { createRoom, getLastUserRooms } from "../api/room";
import moment from "moment";
import Typography from "@material-ui/core/Typography/Typography";

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

class CreateRoomForm extends React.Component {
  state = { rooms: [] };

  componentDidMount() {
    const { uid } = this.props;
    getLastUserRooms(uid).then(rooms => this.setState({ rooms }));
  }

  render() {
    const {
      userName,
      roomName,
      history,
      uid,
      saveForm,
      setCurrentRoomId
    } = this.props;
    return (
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
        <Row full centered>
          <div style={{ width: 150, padding: 4, marginBottom: 20 }}>
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
        {this.state.rooms.map(room => (
          <Row full key={room.roomId}>
            <Row full>
              <Link to={"/" + room.roomId}>{room.roomName}</Link>
            </Row>
            <Row full>
              <Typography variant="caption">
                {moment(room.joinDate).fromNow()}
              </Typography>
            </Row>
          </Row>
        ))}
      </CenteredPage>
    );
  }
}

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
