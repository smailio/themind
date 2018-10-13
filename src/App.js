import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import store from "./store";
import Root from "./Root";

const App = () => (
  <Provider store={store}>
    <Root />
  </Provider>
);

export default App;
