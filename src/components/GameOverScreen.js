import React from "react";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import Dialog from "@material-ui/core/Dialog/Dialog";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";

const GameOverScreen = props => (
  <Dialog
    // fullScreen={fullScreen}
    open={true}
    // onClose={this.handleClxose}
    aria-labelledby="responsive-dialog-title"
  >
    <DialogContent>
      <Grid container spacing={24} justify="center">
        <Grid item xs={12}>
          <Typography variant="h3" align="center">
            GAME OVER
          </Typography>
        </Grid>
        <Grid item>
          {!props.gameIsStarting && (
            <Button
              color="secondary"
              size="small"
              variant="outlined"
              onClick={props.reStartGame}
            >
              PLAY AGAIN
            </Button>
          )}
          {props.gameIsStarting && (
            <Button color="secondary">
              <CircularProgress />
            </Button>
          )}
        </Grid>
      </Grid>
    </DialogContent>
  </Dialog>
);

export default withRouter(
  connect(
    state => ({
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
      reStartGame: () => actions.reStartGame(roomId)(dispatch)
    })
  )(GameOverScreen)
);
