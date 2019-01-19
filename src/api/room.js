import { db } from "../initFirebase";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/functions";

const ROOM_COLLECTION = "rooms";
const PLAYER_COLLECTION = "players";

export function createRoom(uid, userName, roomName) {
  // prettier-ignore
  console.log("room.js createRoom(name : : ", roomName, "userName : ", userName, "uid", uid);
  // TODO if not uid ask to try later
  return db
    .collection(ROOM_COLLECTION)
    .add(newRoom(userName, roomName, uid))
    .then(docRef => {
      // prettier-ignore
      console.log("room.js createRoom success docRef", docRef, "id", docRef.id, "get", docRef.get());
      return docRef.id;
    });
}

function newRoom(userName, roomName, uid) {
  return {
    roomName,
    creatorUid: uid,
    players: [],
    gameStarted: false
  };
}

export function getRoomByID(roomId) {
  return db
    .collection(ROOM_COLLECTION)
    .doc(roomId)
    .get()
    .then(doc => doc.data());
}

export function subscribeToRoomById(roomId, observer) {
  return db
    .collection(ROOM_COLLECTION)
    .doc(roomId)
    .onSnapshot(doc => observer(doc.data()));
}

export function enterRoom(roomId, userId) {
  //prettier-ignore
  console.log("room.js enterRoom(roomId : ", roomId, " userId : ", userId);
  return getRoomByID(roomId)
    .catch(err => {
      //prettier-ignore
      console.error("room.js enterRoom getRoomByID error", err);
      return { type: "ROOM_NOT_FOUND" };
    })
    .then(room => {
      //prettier-ignore
      console.log("room.js enterRoom getRoomByID success room", room,
          " roomId", roomId, " user id : ", userId);
      if (room === undefined) {
        return { type: "ROOM_NOT_FOUND" };
      }
      if (room.players.map(p => p.uid).includes(userId)) {
        //prettier-ignore
        console.log("room.js enterRoom getRoomByID success user already in room " + userId);
        return { type: "SHOW_ROOM", room };
      } else if (room.gameStarted) {
        console.log(
          "room.js enterRoom getRoomByID success game started " + userId
        );
        if (room.players.map(p => p.uid).includes(userId)) {
          return { type: "GAME_STARTED", room };
        } else {
          return { type: "JOINING_OVER", room };
        }
      } else {
        //prettier-ignore
        console.log("room.js enterRoom getRoomByID success ", userId,
            " not in room ", room, " players ", room.players.map(p => p.uid));
        return { type: "ASK_NAME", room };
      }
    })
    .catch(eee => {
      //prettier-ignore
      console.log("room.js enterRoom error", eee);
      return { type: "ERROR" };
    });
}

export function quitRoom() {}

export function joinRoom(roomId, userId, userName) {
  //prettier-ignore
  console.log("room.js joinRoom( roomId : ", roomId, " userName : ", userName, " userId : ", userId);
  return getRoomByID(roomId)
    .catch(err => {
      //prettier-ignore
      console.error("room.js getRoomByID error " + err);
      return { type: "ROOM_ID_INCORRECT" };
    })
    .then(room => {
      //prettier-ignore
      console.log("room.js getRoomByID success ",
          room, " roomId : ", roomId, " userName : ", userName, " userId : ", userId);
      if (room.players.map(p => p.uid).includes(userId)) {
        return { type: "SHOW_ROOM", roomId };
      } else if (room.gameStarted) {
        return { type: "GAME_STARTED" };
      } else if (room.players.map(p => p.userName).includes(userName)) {
        return { type: "NAME_ALREADY_EXISTS" };
      } else if (room.players.length > 8) {
        return { type: "ROOM_IS_FULL" };
      } else if (userName.length > 15) {
        return { type: "NAME_TOO_LONG" };
      } else if (!userName || userName.trim().length < 1) {
        return { type: "USER_NAME_REQUIRED" };
      } else {
        return addUserToRoom(userId, userName, roomId).then(r => {
          //prettier-ignore
          console.log("room.js addUsertToRoom success ", r);
          return { type: "SHOW_ROOM" };
        });
      }
    });
}

function addUserToRoom(uid, userName, roomId) {
  //prettier-ignore
  console.log("room.js addUserToRoom(uid : ", uid, "userName : ", userName, " roomId : ", roomId);
  const joinRoom = firebase.functions().httpsCallable("joinRoom");
  return joinRoom({ roomId, userName });
}

export function startGame(roomId) {
  const startGame = firebase.functions().httpsCallable("startGame");
  return startGame({ roomId });
}

export function reStartGame(roomId) {
  const startGame = firebase.functions().httpsCallable("reStartGame");
  return startGame({ roomId });
}

export function play(roomId, card) {
  const startGame = firebase.functions().httpsCallable("play");
  return startGame({ roomId, card });
}

export function voteShuriken(roomId, okForShuriken) {
  const vote = firebase.functions().httpsCallable("voteShuriken");
  return vote({ roomId, okForShuriken });
}

export function getLastUserRooms(uid) {
  return db
    .collection(PLAYER_COLLECTION)
    .doc(uid)
    .get()
    .then(doc => doc.data())
    .then(
      player =>
        player !== undefined && player.rooms !== undefined ? player.rooms : []
    );
}
