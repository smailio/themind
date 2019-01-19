import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import React from "react";
import Grid from "@material-ui/core/Grid/Grid";

const Loader = () => (
  <Grid
    container
    alignItems="center"
    justify="center"
    style={{
      minHeight: "80vh",
      marginTop: "8vh"
    }}
  >
    <Grid item xs={3}>
      <CircularProgress size={80} />
    </Grid>
  </Grid>
);

export default Loader;
