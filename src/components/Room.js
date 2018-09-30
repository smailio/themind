import React from 'react';
import { connect } from 'react-redux';
import { db } from '../initFirebase';
import store from '../store';

function loadRoom(roomId) {
  db
    .collection('rooms')
    .doc(roomId)
    .onSnapshot(doc => {
      store.dispatch({ type: 'SET_ROOM', room: doc.data() });
      console.log('doc.data ', doc.data());
      console.log('doc', doc);
    });
}

class Room extends React.Component {
  componentDidMount() {
    loadRoom(this.props.match.params.roomId);
    // get the room
    // listen and set state on change
    //
  }

  render() {
    if (!this.props.roomLoaded) {
      return <div>room is loading</div>;
    } else {
      console.log('render this.props', this.props);
      return (
        <div>
          {this.props.players.map(player => (
            <div key={player.uid}> {player.userName}</div>
          ))}
        </div>
      );
    }
  }
}

export default connect(state => state.currentRoom)(Room);
