import { createStore, combineReducers, applyMiddleware } from "redux";
import logger from "redux-logger";
import _ from "lodash";
import { enqueueNotification } from "./notificationMiddleware";

function form(
  state = {
    userName: "",
    roomName: "",
    userNameTooLong: false,
    nameAlreadyExists: false,
    roomIsFull: false
  },
  action
) {
  switch (action.type) {
    case "SET_FORM":
      return {
        ...state,
        ...action.form,
        userNameTooLong: action.form.userName.length > 15,
        nameAlreadyExists: false,
        roomIsFull: false,
        userNameRequired: false
      };
    case "NAME_ALREADY_EXISTS":
      return {
        ...state,
        nameAlreadyExists: true
      };
    case "ROOM_IS_FULL":
      return {
        ...state,
        roomIsFull: true
      };
    case "USER_NAME_REQUIRED":
      return {
        ...state,
        userNameRequired: true
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
        roomLoaded: true,
        roomNotFound: true
      };
    case "ROOM_ERROR":
      return {
        ...state,
        error: true
      };
    case "START_GAME_REQUEST":
      return {
        ...state,
        gameIsStarting: true
      };
    case "START_GAME_SUCCESS":
    case "START_GAME_FAILURE":
      return {
        ...state,
        gameIsStarting: false
      };
    default:
      return state;
  }
}

function disablePlay(state = false, action) {
  switch (action.type) {
    case "PLAY_REQUEST":
      return true;
    case "PLAY_SUCCESS":
    case "PLAY_FAILURE":
      return false;
    default:
      return state;
  }
}

function showSuccessAlert(
  state = { show: false, roundNumber: undefined },
  action
) {
  switch (action.type) {
    case "SET_ROOM":
      if (
        (state.roundNumber !== undefined &&
          action.room.roundNumber > state.roundNumber) ||
        state.show
      ) {
        return {
          show: true,
          roundNumber: action.room.roundNumber
        };
      } else {
        return { roundNumber: action.room.roundNumber, show: false };
      }
    case "CLOSE_SUCCESS_ALERT":
      return { ...state, show: false };
    default:
      return state;
  }
}

function showJoinRoomSpinner(state = false, action) {
  switch (action.type) {
    case "JOINING_ROOM":
      return true;
    default:
      return false;
  }
}

const reducer = combineReducers({
  form,
  user,
  currentRoom,
  showSuccessAlert,
  disablePlay,
  showJoinRoomSpinner
});

export function playerColors(state) {
  const colors = [
    "#1769aa",
    "#cccc00",
    "#4bac4f",
    "tomato",
    "#ff9800",
    "#ed4b82",
    "#4a148c"
  ];

  return {
    ..._.fromPairs(
      state.currentRoom.players
        .filter(p => p.uid !== state.user.uid)
        .map((p, i) => [p.uid, colors[i]])
    ),
    [state.user.uid]: "black"
  };
}

export function playerNames(state) {
  let _playerNames = _.fromPairs(
    state.currentRoom.players
      .filter(p => p.uid !== state.user.uid)
      .map(p => [p.uid, p.userName])
  );
  _playerNames[state.user.uid] = "You";
  return _playerNames;
}

export function currentPlayerIsInRoom(state) {
  return (
    state.currentRoom &&
    state.currentRoom.players &&
    state.currentRoom.players.length > 0 &&
    state.currentRoom.players.map(p => p.uid).includes(state.user.uid)
  );
}

const store = createStore(
  reducer,
  applyMiddleware(logger, enqueueNotification)
);
export default store;
