import React from "react";
import { withRouter } from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import Grid from "@material-ui/core/Grid";
import * as actions from "../actions";
import Typography from "@material-ui/core/Typography/Typography";
import LevelHeader from "./LevelHeader";
import OtherPlayers from "./OtherPlayers";
import Table from "./Table";
import Hand from "./Hand";
import RoundSuccessAlert from "./RoundSuccessAlert";
import GameOverScreen from "./GameOverScreen";
import SuggestShuriken from "./SuggestShuriken";
import ShurikenVoteAlert from "./ShurikenVoteAlert";

class Game extends React.Component {
  render() {
    //prettier-ignore
    console.log("Game render " , this.props);
    if (this.props.gameSuccess) {
      return (
        <Typography variant="h3" align="center">
          GAME SUCCESS
        </Typography>
      );
    }
    return (
      <Grid container spacing={24}>
        {this.props.gameOver && <GameOverScreen />}
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <LevelHeader />
        </Grid>
        <Grid
          item
          xs={12}
          style={
            this.props.hand.length === 0
              ? { minHeight: "10.4em" }
              : { minHeight: "1.4em" }
          }
        >
          <OtherPlayers />
        </Grid>
        {this.props.hand.length > 0 && (
          <Grid item xs={12} style={{ height: "9em" }}>
            <Hand />
          </Grid>
        )}
        <Grid item xs={12}>
          <Typography
            variant="h6"
            style={{ textAlign: "center", color: "#616161" }}
          >
            {this.props.hand.length
              ? "Play your lowest card"
              : "Wait for other players"}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <SuggestShuriken />
        </Grid>
        <Grid item xs={12}>
          <hr />
          <RoundSuccessAlert />
          <ShurikenVoteAlert />
        </Grid>
        <Grid item xs={12}>
          <Table />
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(
  connect(
    state => ({
      ...state.currentRoom,
      hand: state.currentRoom.hands[state.user.uid],
      userId: state.user.uid,
      disablePlay: state.disablePlay,
      gameIsStarting: state.currentRoom.gameIsStarting
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
      play: card => actions.play(roomId, card)(dispatch),
      reStartGame: () => actions.reStartGame(roomId)(dispatch)
    })
  )(Game)
);
