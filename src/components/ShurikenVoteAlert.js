import React from "react";
import { connect } from "react-redux";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import Dialog from "@material-ui/core/Dialog/Dialog";
import { voteShuriken } from "../api/room";
import { withRouter } from "react-router-dom";

const ShurikenVoteAlert = ({
  shurikenVoteInProgress,
  hasVoted,
  voteShuriken
}) => {
  return (
    <Dialog open={shurikenVoteInProgress} aria-labelledby="vote-is-open-dialog">
      {hasVoted ? (
        <DialogContent>
          <DialogContentText variant="h6" style={{ color: "#7cb342" }}>
            Wait for the other players ...
          </DialogContentText>
        </DialogContent>
      ) : (
        <React.Fragment>
          <DialogContent>
            <DialogContentText variant="h5" style={{ color: "#7cb342" }}>
              Do you agree to use a shuriken to discard the lowest card of each
              player ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => voteShuriken(true)} color="primary">
              OK
            </Button>
            <Button onClick={() => voteShuriken(false)} color="primary">
              NO
            </Button>
          </DialogActions>
        </React.Fragment>
      )}
    </Dialog>
  );
};

export default withRouter(
  connect((state, props) => ({
    shurikenVoteInProgress: state.currentRoom.shurikenVoteInProgress,
    hasVoted: state.currentRoom.shurikenVoters.includes(state.user.uid),
    voteShuriken: vote => voteShuriken(props.match.params.roomId, vote)
  }))(ShurikenVoteAlert)
);
