import React from "react";
import CenteredPage from "./CenteredPage";
import Row from "./Row";
import RedButton from "./RedButton";
import * as actions from "../actions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

function join(l, separator, lastSeparator) {
  if (l.length < 2) {
    return l[0];
  }
  const part1 = l.slice(0, l.length - 1);
  return part1.join(separator) + lastSeparator + l[l.length - 1];
}

class WaitingRoom extends React.Component {
  render() {
    console.log("WaitingRoom render", this.props);
    const {
      creatorUid,
      userId,
      gameIsStarting,
      playersCount,
      startGame
    } = this.props;
    const canStartGame =
      creatorUid === userId && !gameIsStarting && playersCount > 1;

    return (
      <CenteredPage columnar>
        <Row style={{ marginBottom: 24 }}>
          <Typography
            variant="h5"
            style={{ textAlign: "center", color: "#616161" }}
          >
            {join(
              this.props.playersNames.map(n => n.toUpperCase()),
              ", ",
              " and "
            )}{" "}
            joined the game.
          </Typography>
        </Row>
        <Row centered>
          {canStartGame && (
            <RedButton style={{ width: "8em" }} onClick={startGame}>
              Start Game
            </RedButton>
          )}
          {gameIsStarting && (
            <RedButton style={{ width: "8em" }}>
              <CircularProgress />
            </RedButton>
          )}
          <Typography
            variant="h5"
            style={{ textAlign: "center", color: "#616161" }}
          >
            {playersCount < 2 && "You must be at least two to start a game"}
            {creatorUid !== userId &&
              "Wait for the room creator to start the game"}
          </Typography>
        </Row>
      </CenteredPage>
    );
  }
}

let container = withRouter(
  connect(
    state => ({
      gameIsStarting: state.currentRoom.gameIsStarting,
      playersCount: state.currentRoom.players.length,
      creatorUid: state.currentRoom.creatorUid,
      userId: state.user.uid,
      playersNames: state.currentRoom.players.map(p => p.userName)
    }),
    (dispatch, props) => ({
      startGame: () => actions.startGame(props.match.params.roomId)(dispatch)
    })
  )(WaitingRoom)
);
export default container;
