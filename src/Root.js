import CenteredPage from "./components/CenteredPage";
import { BrowserRouter as Router, Route } from "react-router-dom";
import CreateRoomForm from "./components/CreateRoomForm";
import Room from "./components/Room";
import JoinRoomForm from "./components/JoinRoomForm";
import React from "react";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./components/Loader";

const Root = ({ isConnected }) => {
  if (!isConnected) {
    return (
      <CenteredPage>
        <Loader />
      </CenteredPage>
    );
  }
  return (
    <Router>
      <CenteredPage>
        <Route exact path="/" component={CreateRoomForm} />
        <Route path="/:roomId" component={Room} exact />
        <Route path="/join/:roomId" component={JoinRoomForm} />
        <ToastContainer
          autoClose={7500}
          draggablePercent={40}
          position="bottom-center"
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
      </CenteredPage>
    </Router>
  );
};

export default connect(state => ({ isConnected: state.user.isConnected }))(
  Root
);
