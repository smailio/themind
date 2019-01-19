import React from "react";
import { connect } from "react-redux";
import Grow from "@material-ui/core/Grow/Grow";
import Grid from "@material-ui/core/Grid/Grid";
import Button from "@material-ui/core/Button/Button";
import { playerColors } from "../store";

class Table extends React.Component {
  render() {
    return (
      <Grid container spacing={16}>
        {this.props.cardsOnTable.map(card => (
          <Grid item key={card.card}>
            <Grow in={true}>
              <Button
                style={{
                  height: "3rem",
                  minHeight: "3rem",
                  width: "1.7rem",
                  minWidth: "1.7rem",
                  fontSize: "0.8rem",
                  color: this.props.playerColors[card.playerId],
                  borderColor: this.props.playerColors[card.playerId]
                }}
                variant="outlined"
                size="small"
              >
                {card.card}
              </Button>
            </Grow>
          </Grid>
        ))}
      </Grid>
    );
  }
}

export default connect(state => ({
  cardsOnTable: state.currentRoom.cardsOnTable,
  playerColors: playerColors(state)
}))(Table);
