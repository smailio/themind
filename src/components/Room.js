import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import WaitingRoom from "./WaitingRoom";
import CenteredPage from "./CenteredPage";
import Game from "./Game";
import * as actions from "../actions";
import Loader from "./Loader";

class Room extends React.Component {
  componentDidMount() {
    console.log("Room componentDidMount props", this.props);
    console.log("Room componentDidMount call enterRoom");
    this.props.enterRoom().then(exitRoom => {
      console.log("save exitRoom function in this", exitRoom, this);
      this.exitRoom = exitRoom;
    });
  }

  componentWillUnmount() {
    if (this.exitRoom) {
      this.exitRoom();
    }
  }

  render() {
    console.log("Room render this.props", this.props);
    if (!this.props.roomLoaded) {
      return <Loader />;
    } else if (this.props.roomNotFound) {
      return (
        <CenteredPage>It seems that this room doesn't exists</CenteredPage>
      );
    } else if (this.props.joiningClosed) {
      return <CenteredPage>A game is in progress in this room !</CenteredPage>;
    } else if (!this.props.gameStarted) {
      return <WaitingRoom />;
    } else {
      return <Game />;
    }
  }
}

export default withRouter(
  connect(
    state => ({
      currentRoom: state.currentRoom,
      userId: state.user.uid,
      joiningClosed:
        state.currentRoom.gameStarted &&
        !state.currentRoom.players.map(p => p.uid).includes(state.user.uid)
    }),
    (
      dispatch,
      {
        history,
        match: {
          params: { roomId }
        }
      }
    ) => ({
      enterRoom: userId => actions.enterRoom(roomId, userId)(dispatch, history)
    }),
    (
      stateProps,
      dispatchProps,
      {
        match: {
          params: { roomId }
        }
      }
    ) => {
      const { currentRoom, ...rest } = stateProps;
      return {
        ...(currentRoom.roomId === roomId
          ? currentRoom
          : { roomLoaded: false }),
        ...dispatchProps,
        ...rest,
        enterRoom: () => dispatchProps.enterRoom(stateProps.userId)
      };
    }
  )(Room)
);
