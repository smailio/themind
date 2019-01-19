import React from "react";
import Grid from "@material-ui/core/Grid/Grid";

const CenteredPage = props => (
  <div style={{ padding: 12 }}>
    <Grid
      container
      // alignItems="center"
      justify="center"
      style={{
        // marginRight: "auto",
        // marginLeft: "auto",
        // width: 400,
        minHeight: "80vh",
        paddingTop: 20
        // marginTop: 20
      }}
      // direction={props.columnar ? "column" : "row"}
      spacing={24}
    >
      <Grid item xs={12} sm={7} md={6} lg={5}>
        {props.children}
      </Grid>
    </Grid>
  </div>
);

export default CenteredPage;
