import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

/*
------------------------------------------------------------------------------
/ user name input , room name input, create room button  join room button
------------------------------------------------------------------------------
/{roomName} :
    - state waiting :
        - user is owner : list of players, button to start the game
        - user is player : list of players.
        - else : redirect to root page with room name pre-filled
    - state started :
        - user is player : list of number, switch button is ready
        - else : 404
    - doesn't exist : 404

what if user create room, and come back to home ?
what if user join room that doesn't exist
------------------------------------------------------------------------------
*/

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
