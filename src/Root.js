import CenteredPage from "./components/CenteredPage";
import { BrowserRouter as Router, Route } from "react-router-dom";
import CreateRoomForm from "./components/CreateRoomForm";
import Room from "./components/Room";
import JoinRoomForm from "./components/JoinRoomForm";
import React from "react";
import { connect } from "react-redux";

const Loader = () => <CenteredPage>User is connecting</CenteredPage>;
const Root = ({ isConnected }) => {
  return (
    <Router>
      <div>
        <Route exact path="/" component={CreateRoomForm} />
        <Route path="/:roomId" component={isConnected ? Room : Loader} exact />
        <Route
          path="/join/:roomId"
          component={isConnected ? JoinRoomForm : Loader}
        />
      </div>
    </Router>
  );
};

export default connect(state => ({ isConnected: state.user.isConnected }))(
  Root
);
