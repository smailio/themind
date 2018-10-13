import { db } from "../initFirebase";
import firebase from "firebase/app";
import "firebase/firestore";

const ROOM_COLLECTION = "rooms";

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

export function enterRoom(roomId, userId) {
  //prettier-ignore
  console.log("room.js enterRoom(roomId : ", roomId, " userId : ", userId);
  return getRoomByID(roomId)
    .catch(err => {
      console.error("room.js enterRoom getRoomByID error", err);
      return { type: "ROOM_NOT_FOUND" };
    })
    .then(room => {
      //prettier-ignore
      console.log("room.js enterRoom getRoomByID success room", room, " roomId", roomId, " user id : ", userId);
      if (room.players.map(p => p.uid).includes(userId)) {
        console.log(
          "room.js enterRoom getRoomByID success user already in room " + userId
        );
        return { type: "SHOW_ROOM", room };
      } else {
        //prettier-ignore
        console.log("room.js enterRoom getRoomByID success ", userId, " not in room ", room, " players ", room.players.map(p => p.uid));
        return { type: "ASK_NAME" };
      }
    })
    .catch(eee => {
      console.log("room.js enterRoom error", eee);
      return { type: "ERROR" };
    });
}

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
      console.log("room.js getRoomByID success ", room, " roomId : ", roomId, " userName : ", userName, " userId : ", userId);
      if (room.players.map(p => p.uid).includes(userId)) {
        return { type: "SHOW_ROOM", roomId };
      } else if (room.gameStarted) {
        return { type: "GAME_STARTED" };
      } else if (room.players.map(p => p.userName).includes(userName)) {
        return { type: "NAME_ALREADY_EXISTS" };
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
  return db
    .collection(ROOM_COLLECTION)
    .doc(roomId)
    .update({
      players: firebase.firestore.FieldValue.arrayUnion({ uid, userName })
    });
}

export function startGame(roomId) {
  return db
    .collection(ROOM_COLLECTION)
    .doc(roomId)
    .update({
      gameStarted: true
    });
}
