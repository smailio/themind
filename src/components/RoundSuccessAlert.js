import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import * as actions from "../actions";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Dialog from "@material-ui/core/Dialog/Dialog";

class RoundSuccessAlert extends React.Component {
  render() {
    const rexardText = [3, 6, 9].includes(this.props.roundNumber)
      ? " and you get a life."
      : [2, 5, 8].includes(this.props.roundNumber)
        ? " and you get a shuriken."
        : ".";
    return (
      <Dialog open={this.props.show} aria-labelledby="responsive-dialog-title">
        <DialogContent>
          <DialogContentText variant="h4" style={{ color: "#7cb342" }}>
            Success ! You go to round {this.props.roundNumber}
            {rexardText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => this.props.closeSuccessAlert()}
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default connect(
  state => state.showSuccessAlert,
  dispatch => ({
    closeSuccessAlert: () => actions.closeSuccessAlert()(dispatch)
  })
)(RoundSuccessAlert);
