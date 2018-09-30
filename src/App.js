import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import RoomForm from './components/RoomForm';
import Room from './components/Room';


const App = () => (
  <Provider store={store}>
    <Router>
      <div>
        <Route exact path="/" component={RoomForm} />
        <Route path="/:roomId" component={Room} />
      </div>
    </Router>
  </Provider>
);

export default App;
