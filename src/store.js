import { createStore, combineReducers } from "redux";

function form(
  state = {
    userName: "",
    roomName: ""
  },
  action
) {
  switch (action.type) {
    case "SET_FORM":
      return {
        ...state,
        ...action.form
      };
    default:
      return state;
  }
}

function user(
  state = {
    uid: "",
    isConnected: false
  },
  action
) {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        uid: action.uid,
        isConnected: true
      };
    default:
      return state;
  }
}

function currentRoom(
  state = {
    roomLoaded: false,
    roomNotFound: false,
    error: false
  },
  action
) {
  switch (action.type) {
    case "SET_ROOM":
      return {
        ...state,
        roomLoaded: true,
        ...action.room
      };
    case "ROOM_NOT_FOUND":
      return {
        ...state,
        roomLoaded: false,
        roomNotFound: true
      };
    case "ROOM_ERROR":
      return {
        ...state,
        error: true
      };
    default:
      return state;
  }
}

const reducer = combineReducers({
  form,
  user,
  currentRoom
});

const store = createStore(reducer);
export default store;
