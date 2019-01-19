import React from "react";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";
import { connect } from "react-redux/";
import { voteShuriken } from "../api/room";
import { withRouter } from "react-router-dom";

const SuggestShuriken = ({ remainingShurikens, suggestUsingShuriken }) => {
  if (remainingShurikens < 1) {
    return null;
  }
  return (
    <Grid container justify="center" spacing={16} alignItems="center">
      <Grid item>
        <Typography style={{ color: "rgb(205, 220, 57)" }}>OR</Typography>
      </Grid>
      <Grid item>
        <Button
          variant="outlined"
          style={{
            color: "rgb(205, 220, 57)",
            borderColor: "rgb(205, 220, 57)"
          }}
          onClick={suggestUsingShuriken}
        >
          SUGGEST USING A SHURIKEN
        </Button>
      </Grid>
    </Grid>
  );
};

export default withRouter(
  connect((state, props) => ({
    remainingShurikens: state.currentRoom.stars,
    suggestUsingShuriken: () => voteShuriken(props.match.params.roomId, true)
  }))(SuggestShuriken)
);
