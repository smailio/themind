import * as api from "./api/room";

export function setRoom(room) {
  return dispatch => dispatch({ type: "SET_ROOM", room });
}
export function setRoomNotFound() {
  return dispatch => dispatch({ type: "ROOM_NOT_FOUND" });
}
export function setRoomError() {
  return dispatch => dispatch({ type: "ROOM_ERROR" });
}
export function closeSuccessAlert() {
  return dispatch => dispatch({ type: "CLOSE_SUCCESS_ALERT" });
}

export function enterRoom(roomId, userId) {
  return (dispatch, history) =>
    api.enterRoom(roomId, userId).then(r => {
      const type = r.type;
      console.log("Room componentDidMount enterRoom then type", type);
      const exitRoom = api.subscribeToRoomById(roomId, room => {
        return setRoom({ ...room, roomId })(dispatch);
      });
      switch (type) {
        case "ASK_NAME":
          console.log("Room REDIRECT TO JOIN ROOM");
          history.push(`/join/${roomId}`);
          break;
        case "ROOM_NOT_FOUND":
          setRoomNotFound()(dispatch);
          break;
        case "ERROR":
          setRoomError()(dispatch);
          break;
        case "SHOW_ROOM":
        case "GAME_STARTED":
        case "JOINING_OVER":
          history.push("/" + roomId);

          break;
        default:
          break;
      }
      return exitRoom;
    });
}

export function exitRoom() {}

export function joinRoom(roomId, userId, userName) {
  return (dispatch, history) => {
    dispatch({ type: "JOINING_ROOM" });
    api.joinRoom(roomId, userId, userName).then(({ type }) => {
      if (type === "SHOW_ROOM" || type === "GAME_STARTED") {
        //prettier-ignore
        console.log("JoinRoomForm joinRoom success rediret to Room " + roomId + " because " + type);
        history.push("/" + roomId);
      } else if (type === "NAME_ALREADY_EXISTS") {
        console.log("JoinRoomForm joinRoom response NAME_ALREADY_EXISTS");
        dispatch({ type, roomId });
      } else {
        console.log("JoinRoomForm joinRoom response " + type);
        dispatch({ type });
      }
    });
  };
}

export function startGame(roomId) {
  return dispatch => {
    console.log("WaitingRoom startGame(roomId : ", roomId);
    dispatch({ type: "START_GAME_REQUEST" });
    api
      .startGame(roomId)
      .then(data => {
        //prettier-ignore
        dispatch({ type: "START_GAME_SUCCESS" });

        console.log("actions.js startGame success data : ", data);
      })
      .catch(err => {
        dispatch({ type: "START_GAME_FAILURE" });
        //prettier-ignore
        console.log("actions.js startGame error", err.message);
        // setRoomError()(dispatch);
      });
  };
}

export function play(roomId, card) {
  return dispatch => {
    console.log("actions.js plat ", roomId, card);
    dispatch({ type: "PLAY_REQUEST", card });
    api
      .play(roomId, card)
      .then(e => {
        console.log("actions.js play success ", e);
        dispatch({ type: "PLAY_SUCCESS", card });
      })
      .catch(err => {
        dispatch({ type: "PLAY_FAILURE", card });
        console.log("actions.js play error ", roomId, card, err);
      });
  };
}

export function reStartGame(roomId) {
  return dispatch => {
    console.log("actions.js restart ", roomId);
    dispatch({ type: "START_GAME_REQUEST" });

    api
      .reStartGame(roomId)
      .then(data => {
        //prettier-ignore
        dispatch({ type: "START_GAME_SUCCESS" });

        console.log("actions.js startGame success data : ", data);
      })
      .catch(err => {
        dispatch({ type: "START_GAME_FAILURE" });
        //prettier-ignore
        console.log("actions.js startGame error", err.message);
        // setRoomError()(dispatch);
      });
  };
}
