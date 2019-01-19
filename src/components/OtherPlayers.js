import React from "react";
import Typography from "@material-ui/core/Typography/Typography";
import { connect } from "react-redux";
import { playerColors } from "../store";
import Grid from "@material-ui/core/Grid/Grid";

class OtherPlayers extends React.Component {
  render() {
    console.log("OtherPlayers render", this.props);
    return (
      <Grid container spacing={0}>
        {this.props.players
          .filter(p => p.uid !== this.props.userId)
          .map((p, i) => (
            <React.Fragment key={p.uid}>
              <Grid item>
                <Typography
                  component="span"
                  style={{
                    display: "inline",
                    marginRight: 5,
                    color: this.props.playerColors[p.uid],
                    fontWeight: "bolder",
                    transition: "all .33s ease-in-out",

                    fontSize: this.props.hand.length === 0 ? "1.8em" : undefined
                  }}
                >
                  {p.userName.toUpperCase()}
                </Typography>
              </Grid>

              {p.cardsCount > 0 ? (
                <React.Fragment>
                  <Grid item>
                    <Typography
                      style={{
                        display: "inline",
                        marginRight: 5,
                        transition: "all .33s ease-in-out",

                        fontSize:
                          this.props.hand.length === 0 ? "1.8em" : undefined
                      }}
                      component="span"
                    >
                      has
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      component="span"
                      style={{
                        fontSize:
                          this.props.hand.length === 0 ? "1.8em" : undefined,
                        display: "inline",
                        marginRight: 5,
                        color: this.props.playerColors[p.uid],
                        transition: "all .33s ease-in-out",
                        fontWeight: "bolder"
                      }}
                    >
                      {p.cardsCount}
                    </Typography>
                  </Grid>
                  {i === 0 && (
                    <Grid item>
                      <Typography
                        component="span"
                        style={{
                          display: "inline",
                          transition: "all .33s ease-in-out",

                          marginRight: 5,
                          fontSize:
                            this.props.hand.length === 0 ? "1.8em" : undefined
                        }}
                      >
                        {p.cardsCount > 1 ? "cards" : "card"}
                      </Typography>
                    </Grid>
                  )}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Grid item>
                    <Typography
                      style={{
                        display: "inline",
                        marginRight: 5,
                        transition: "all .33s ease-in-out",

                        fontSize:
                          this.props.hand.length === 0 ? "1.8em" : undefined
                      }}
                      component="span"
                    >
                      is
                    </Typography>
                  </Grid>
                  <Grid item>
                    {" "}
                    <Typography
                      component="span"
                      style={{
                        display: "inline",
                        marginRight: 5,
                        color: this.props.playerColors[p.uid],
                        fontWeight: "bolder",
                        transition: "all .33s ease-in-out",

                        fontSize:
                          this.props.hand.length === 0 ? "1.8em" : undefined
                      }}
                    >
                      done
                    </Typography>
                  </Grid>
                </React.Fragment>
              )}
              <Grid item>
                <Typography
                  component="span"
                  style={{
                    display: "inline",
                    marginRight: 5,
                    marginLeft: 5,
                    transition: "all .33s ease-in-out",
                    fontSize: this.props.hand.length === 0 ? "1.8em" : undefined
                  }}
                >
                  {i < this.props.players.length - 2 &&
                  this.props.players.length > 2
                    ? "•"
                    : ""}
                </Typography>
              </Grid>
            </React.Fragment>
          ))}
      </Grid>
    );
  }
}

export default connect(state => ({
  hand: state.currentRoom.hands[state.user.uid],
  players: state.currentRoom.players,
  userId: state.user.uid,
  playerColors: playerColors(state)
}))(OtherPlayers);
