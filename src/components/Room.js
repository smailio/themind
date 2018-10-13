import React from "react";
import { connect } from "react-redux";
import { enterRoom } from "../api/room";
import { withRouter } from "react-router-dom";
import CenteredPage from "./CenteredPage";
import BlueButton from "./BlueButton";
import Row from "./Row";

class Room extends React.Component {
  componentDidMount() {
    console.log("Room componentDidMount props", this.props);
    console.log("Room componentDidMount call enterRoom");
    this.enterRoom();
  }

  enterRoom() {
    const roomId = this.props.match.params.roomId;
    const {
      userId,
      history,
      setRoom,
      setRoomNotFound,
      setRoomError
    } = this.props;
    enterRoom(roomId, userId).then(r => {
      const type = r.type;
      console.log("Room componentDidMount enterRoom then type", type);
      switch (type) {
        case "ASK_NAME":
          console.log("Room REDIRECT TO JOIN ROOM");
          history.push(`join/${roomId}`);
          break;
        case "SHOW_ROOM":
          setRoom(r.room);
          break;
        case "ROOM_NOT_FOUND":
          setRoomNotFound();
          break;
        case "ERROR":
          setRoomError();
          break;
        default:
          break;
      }
    });
  }

  render() {
    console.log("Room render this.props", this.props);
    if (!this.props.roomLoaded) {
      return <CenteredPage>Room is loading</CenteredPage>;
    } else if (this.props.roomNotFound) {
      return <Row>It seems that this room doesn't exists</Row>;
    } else {
      return (
        <CenteredPage columnar>
          <Row style={{ marginBottom: 24 }}>
            {this.props.players.map(player => player.userName).join(", ")}.
          </Row>
          {this.props.creatorUid === this.props.userId && (
            <Row>
              <BlueButton>Start Game</BlueButton>
            </Row>
          )}
        </CenteredPage>
      );
    }
  }
}

export default withRouter(
  connect(
    state => ({
      ...state.currentRoom,
      userId: state.user.uid
    }),
    dispatch => ({
      setRoom: room => dispatch({ type: "SET_ROOM", room }),
      setRoomNotFound: () => dispatch({ type: "ROOM_NOT_FOUND" }),
      setRoomError: () => dispatch({ type: "ROOM_ERROR" })
    })
  )(Room)
);
