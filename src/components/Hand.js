import React from "react";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid/Grid";
import Slide from "@material-ui/core/Slide";
import Button from "@material-ui/core/Button/Button";
import Popper from "@material-ui/core/Popper/Popper";
import Paper from "@material-ui/core/Paper/Paper";
import Typography from "@material-ui/core/Typography/Typography";
import * as actions from "../actions";
import { withRouter } from "react-router-dom";

class Hand extends React.Component {
  state = {
    showLowestCardWarning: false
  };

  anchorEl = null;
  play = (e, card) => {
    this.anchorEl = e.currentTarget;
    if (Math.min(...this.props.hand) === card) {
      this.props.play(card);
    } else {
      this.setState({ showLowestCardWarning: true });
      setTimeout(() => this.setState({ showLowestCardWarning: false }), 3000);
    }
  };

  render() {
    return (
      <Grid container spacing={16}>
        {this.props.hand.map((card, i) => (
          <Grid item key={card}>
            <Slide
              direction="right"
              in={true}
              style={{ transitionDelay: 166 * i }}
            >
              <Button
                style={{
                  height: "3.5rem",
                  minHeight: "3.5rem",
                  width: "2.5rem",
                  minWidth: "2rem",
                  fontSize: "1.3rem"
                }}
                variant="outlined"
                size="small"
                disabled={this.props.disablePlay}
                onClick={e => this.play(e, card)}
              >
                {card}
              </Button>
            </Slide>
          </Grid>
        ))}
        {this.state.showLowestCardWarning && (
          <Popper open anchorEl={this.anchorEl}>
            <Paper style={{ padding: 8, marginTop: 10 }}>
              <Typography color="error">
                You must play your lowest card !
              </Typography>
            </Paper>
          </Popper>
        )}
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
  )(Hand)
);
