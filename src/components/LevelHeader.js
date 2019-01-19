import React from "react";
import { connect } from "react-redux";
import Hidden from "@material-ui/core/Hidden/Hidden";
import Grid from "@material-ui/core/Grid/Grid";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import Zoom from "@material-ui/core/Zoom/Zoom";
import Typography from "@material-ui/core/Typography/Typography";

// class TempBadge extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { showBadge: true };
//     this.timer = setTimeout(() => this.setState({ showBadge: false }), 1000);
//   }
//
//   componentWillUnmount() {
//     clearTimeout(this.timer);
//   }
//
//   render() {
//     if (this.state.showBadge) {
//       return (
//         <Grow in={true}>
//           <Badge
//             badgeContent={this.props.badgeContent}
//             color="primary"
//             style={{ padding: 4 }}
//           >
//             {this.props.children}
//           </Badge>
//         </Grow>
//       );
//     }
//     return this.props.children;
//   }
// }

class LevelHeader extends React.Component {
  render() {
    return (
      <Grid container justify="space-around" alignItems="center">
        <Hidden smDown>
          <Grid item md={1} />
        </Hidden>
        <Grid item>
          <FavoriteBorderIcon style={{ color: "tomato" }} />
        </Grid>
        <Grid item>
          <Zoom in={true} key={this.props.lives}>
            <Typography variant="button" style={{ color: "tomato" }}>
              {this.props.lives}
            </Typography>
          </Zoom>
        </Grid>
        <Grid item xs={3} md={2} lg={1}>
          <Typography variant="button" style={{ textAlign: "center" }}>
            lvl {this.props.roundNumber}
          </Typography>
        </Grid>
        <Grid item>
          <StarBorderIcon style={{ color: "#cddc39" }} />
        </Grid>
        <Grid item>
          <Zoom in={true} key={this.props.stars}>
            <Typography variant="button" style={{ color: "#cddc39" }}>
              {this.props.stars}
            </Typography>
          </Zoom>
        </Grid>
        <Hidden smDown>
          <Grid item md={1} />
        </Hidden>
      </Grid>
    );
  }
}

// const styles = theme => ({
//   margin: {
//     margin: theme.spacing.unit * 2
//   },
//   padding: {
//     padding: `0 ${theme.spacing.unit * 2}px`
//   }
// });

// export default withStyles(styles)(SimpleBadge);

export default connect(state => ({
  stars: state.currentRoom.stars,
  roundNumber: state.currentRoom.roundNumber,
  lives: state.currentRoom.lives
}))(LevelHeader);
