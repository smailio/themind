const functions = require("firebase-functions");
const ROOM_COLLECTION = "rooms";
const PLAYERS_COLLECTION = "players";

const admin = require("firebase-admin");
admin.initializeApp();

function generateHand(players, handSize) {
  const cards = [];
  const nextCard = () => {
    let number = getRandomInt(101);
    while (cards.includes(number)) {
      number = getRandomInt(101);
    }
    cards.push(number);
    return number;
  };

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  const playerHands = {};
  for (const player of players) {
    const playerHand = [];
    for (let i = 0; i < handSize; i++) {
      playerHand.push(nextCard());
    }
    playerHands[player.uid] = playerHand;
  }
  return playerHands;
}

function getInitialLives(playersCount) {
  switch (playersCount) {
    case 2:
      return 2;
    case 3:
      return 3;
    default:
      return 4;
  }
}

function nextRound(room) {
  const nextRound = room.roundNumber + 1;
  if (isLastRound(room.roundNumber, room.players.length)) {
    console.log("play goodMove gameSuccess");
    return { gameSuccess: true };
  } else {
    const nextHands = generateHand(room.players, nextRound);
    //prettier-ignore
    console.log("play goodMove nextRound", nextRound, "nextHands", nextHands);
    const nextLives = [3, 6, 9].includes(nextRound)
      ? room.lives + 1
      : room.lives;
    const nextStars = [2, 5, 8].includes(nextRound)
      ? room.stars + 1
      : room.stars;
    return {
      hands: nextHands,
      roundNumber: nextRound,
      players: room.players.map(p =>
        Object.assign(p, { cardsCount: nextRound })
      ),
      lives: nextLives,
      stars: nextStars,
      cardsOnTable: []
    };
  }
}

function initRoom(room) {
  return {
    hands: generateHand(room.players, 1),
    gameStarted: true,
    roundNumber: 1,
    gameSuccess: false,
    gameOver: false,
    cardsOnTable: [],
    lives: getInitialLives(room.players.length),
    stars: 1,
    players: room.players.map(p => Object.assign(p, { cardsCount: 1 })),
    events: [],
    shurikenVoteInProgress: false,
    shurikenVoters: []
  };
}

function getCardsInHands(room) {
  let cardsInHands = [];
  Object.keys(room.hands).forEach(key => {
    cardsInHands = cardsInHands.concat(room.hands[key]);
  });
  return cardsInHands;
}

exports.startGame = functions.https.onCall((data, context) => {
  const roomId = data.roomId;
  console.log("req data", data, "context", context.auth);
  return admin.firestore().runTransaction(transaction => {
    const documentRef = admin.firestore().doc(`${ROOM_COLLECTION}/${roomId}`);
    return transaction
      .get(documentRef)
      .then(r => r.data())
      .then(room => {
        if (context.auth.uid !== room.creatorUid) {
          return Promise.reject(new Error("Only creator can start the game"));
        }
        if (room.gameStarted) {
          return Promise.reject(new Error("Game already started"));
        }
        if (room.players.length < 2) {
          return Promise.reject(
            new Error("Game require at least 2 players to start")
          );
        }
        console.log("startGame by ", context.auth.uid, " for room ", room);
        return transaction.update(documentRef, initRoom(room));
      });
  });
});

exports.reStartGame = functions.https.onCall((data, context) => {
  const roomId = data.roomId;
  console.log("req data", data, "context", context.auth);
  return admin.firestore().runTransaction(transaction => {
    const documentRef = admin.firestore().doc(`${ROOM_COLLECTION}/${roomId}`);
    return transaction
      .get(documentRef)
      .then(r => r.data())
      .then(room => {
        if (!room.gameSuccess && !room.gameOver) {
          return Promise.reject(new Error("Game still in progress"));
        }
        console.log("re startGame by ", context.auth.uid, " for room ", room);
        return transaction.update(documentRef, {
          hands: generateHand(room.players, 1),
          gameStarted: true,
          roundNumber: 1,
          gameSuccess: false,
          gameOver: false,
          cardsOnTable: [],
          lives: getInitialLives(room.players.length),
          stars: 1,
          players: room.players.map(p => Object.assign(p, { cardsCount: 1 })),
          events: [],
          shurikenVoters: []
        });
      });
  });
});

function nextRoom(room, card, playerId) {
  const events = [...room.events]; // copy list in case events is a managed list
  const cardsInHands = getCardsInHands(room);
  const goodMove = Math.min(...cardsInHands) === card;
  if (!goodMove) {
    events.push({ type: "wrongMove", playerId: playerId, card: card });
    const livesLeft = room.lives > 1;
    const nextHands = {};
    let nextCardsOnTable = room.cardsOnTable;
    Object.keys(room.hands).forEach(key => {
      nextHands[key] = room.hands[key].filter(c => c > card);
      let toDiscard = room.hands[key]
        .filter(c => c <= card)
        .map(c => ({ card: c, playerId: key }));
      nextCardsOnTable = nextCardsOnTable.concat(toDiscard);
      // events.push({ type: "discard", playerId: key, cards: toDiscard });
    });
    const nextPlayers = room.players.map(p =>
      Object.assign(p, { cardsCount: nextHands[p.uid].length })
    );
    //prettier-ignore
    console.log("Lost 1 live nextHands", nextHands, "nextCardsOnTable", nextCardsOnTable);
    if (livesLeft) {
      if (getCardsInHands({ hands: nextHands }).length > 0) {
        return {
          events: events,
          lives: room.lives - 1,
          hands: nextHands,
          cardsOnTable: nextCardsOnTable,
          players: nextPlayers
        };
      } else {
        // events.push({ type: "wrongMoveLeadToNextRoom" });
        const nextRoom = nextRound(room);
        nextRoom.lives = nextRoom.lives - 1;
        return Object.assign(nextRoom, { events: events });
      }
    }
    console.log("play gameOver", cardsInHands);
    return {
      events: events,
      hands: nextHands,
      cardsOnTable: nextCardsOnTable,
      players: nextPlayers,
      gameOver: true
    };
  }
  // events.push({ type: "goodMove", playerId: playerId, card: card });
  if (cardsInHands.length > 1) {
    const nexHand = {};
    nexHand[playerId] = room.hands[playerId].filter(c => c !== card);
    const nextCardsOnTable = room.cardsOnTable.concat([
      { card: card, playerId: playerId }
    ]);
    console.log("play goodMove cardsInHands.length > 1", nexHand);
    return {
      events: events,
      hands: Object.assign(room.hands, nexHand),
      cardsOnTable: nextCardsOnTable,
      players: room.players.map(p => {
        if (p.uid === playerId) {
          return Object.assign(p, { cardsCount: p.cardsCount - 1 });
        }
        return p;
      })
    };
  } else {
    if (isLastRound(room.roundNumber, room.players.length)) {
      console.log("play goodMove gameSuccess");
      return { gameSuccess: true };
    } else {
      const nextRoom = nextRound(room);
      return Object.assign(nextRoom, { events: events });
    }
  }
}

exports.play = functions.https.onCall((data, context) => {
  const roomId = data.roomId;
  const card = data.card;
  const playerId = context.auth.uid;
  if (roomId === undefined || card === undefined) {
    throw new Error("roomID and card required");
  }
  return admin.firestore().runTransaction(transaction => {
    const documentRef = admin.firestore().doc(`${ROOM_COLLECTION}/${roomId}`);
    return transaction
      .get(documentRef)
      .then(r => r.data())
      .then(room => {
        if (!room.players.map(p => p.uid).includes(playerId)) {
          throw Error(`player ${playerId} not in room ${roomId}`);
        }
        const playerHand = room.hands[playerId];
        if (!playerHand || !playerHand.includes(card)) {
          throw Error(`player ${playerId} is not allowed to play card ${card}`);
        }
        return transaction.update(documentRef, nextRoom(room, card, playerId));
      });
  });
});

exports.joinRoom = functions.https.onCall((data, context) => {
  const roomId = data.roomId;
  const playerId = context.auth.uid;
  const userName = data.userName;
  if (roomId === undefined) {
    throw new Error("roomID required");
  }
  return admin.firestore().runTransaction(transaction => {
    const roomRef = admin.firestore().doc(`${ROOM_COLLECTION}/${roomId}`);
    return transaction
      .get(roomRef)
      .then(r => r.data())
      .then(room => {
        const currentPlayers = room.players === undefined ? [] : room.players;
        const currentPlayersIds = currentPlayers.map(p => p.uid);
        if (currentPlayersIds.includes(playerId)) {
          return Promise.reject(new Error("player joined room already"));
        } else if (room.players.length > 8) {
          return Promise.reject(
            new Error(`there is already 8 players in the room`)
          );
        } else if (
          !userName ||
          userName.trim().length < 1 ||
          userName.length > 15
        ) {
          return Promise.reject(new Error(`bad username`));
        } else {
          const nextPlayers = currentPlayers.concat([
            {
              uid: playerId,
              userName: userName
            }
          ]);
          const playerRef = admin
            .firestore()
            .doc(`${PLAYERS_COLLECTION}/${playerId}`);

          return transaction
            .get(playerRef)
            .then(r => r.data())
            .then(player => {
              let nextRooms = [
                {
                  roomId: roomRef.id,
                  roomName: room.roomName,
                  joinDate: Date.now()
                }
              ];
              if (
                player !== undefined &&
                player.rooms !== undefined &&
                player.rooms.length > 0
              ) {
                nextRooms = nextRooms.concat(player.rooms);
              }
              return transaction
                .update(roomRef, { players: nextPlayers })
                .set(playerRef, { rooms: nextRooms });
            });
        }
      });
  });
});

exports.voteShuriken = functions.https.onCall((data, context) => {
  const roomId = data.roomId;
  const okForShuriken = data.okForShuriken;
  const playerId = context.auth.uid;
  return admin.firestore().runTransaction(transaction => {
    const documentRef = admin.firestore().doc(`${ROOM_COLLECTION}/${roomId}`);
    return transaction
      .get(documentRef)
      .then(r => r.data())
      .then(room => {
        if (!room.gameStarted) {
          return Promise.reject(new Error("Game hasn't started yet"));
        }
        if (room.stars < 1) {
          return Promise.reject(new Error("Not enough stars"));
        }
        if (room.shurikenVoters.includes(playerId)) {
          return Promise.reject(new Error("Player already voted"));
        }
        if (!room.players.map(p => p.uid).includes(playerId)) {
          return Promise.reject(
            new Error(`player ${playerId} not in room ${roomId}`)
          );
        }
        console.log("voteShuriken by ", context.auth.uid, " for room ", room);
        if (okForShuriken) {
          const nextShurikenVoters = [playerId].concat(room.shurikenVoters);
          const playerIds = room.players.map(p => p.uid);
          // checking length is enough because we check earlier if a player has already voted
          let allPlayerHaveVoted =
            playerIds.length === nextShurikenVoters.length;
          if (allPlayerHaveVoted) {
            const nexRoom = userShuriken(room);
            return transaction.update(
              documentRef,
              Object.assign(nexRoom, {
                shurikenVoteInProgress: false,
                shurikenVoters: [],
                stars: nexRoom.stars - 1
              })
            );
          } else {
            return transaction.update(documentRef, {
              shurikenVoteInProgress: true,
              shurikenVoters: nextShurikenVoters
            });
          }
        } else {
          return transaction.update(documentRef, {
            shurikenVoteInProgress: false,
            shurikenVoters: []
          });
        }
      });
  });
});

function userShuriken(room) {
  const playerIds = Object.keys(room.hands).filter(
    uid => room.hands[uid].length > 0
  );
  let nextRoom = room;
  for (const playerId of playerIds) {
    const card = Math.min(...nextRoom.hands[playerId]);
    const cardsInHands = getCardsInHands(nextRoom);
    if (cardsInHands.length > 1) {
      const nexHand = {};
      nexHand[playerId] = nextRoom.hands[playerId].filter(c => c !== card);
      const nextCardsOnTable = nextRoom.cardsOnTable.concat([
        { card: card, playerId: playerId }
      ]);
      nextRoom = Object.assign(nextRoom, {
        hands: Object.assign(nextRoom.hands, nexHand),
        cardsOnTable: nextCardsOnTable,
        players: nextRoom.players.map(p => {
          if (p.uid === playerId) {
            return Object.assign(p, { cardsCount: p.cardsCount - 1 });
          }
          return p;
        })
      });
    } else {
      return nextRound(room);
    }
  }
  return nextRoom;
}

function isLastRound(roundNumber, numberOfPlayer) {
  if (roundNumber === 7 && numberOfPlayer > 4) return true;
  if (roundNumber === 8 && numberOfPlayer === 4) return true;
  if (roundNumber === 10 && numberOfPlayer === 3) return true;
  // noinspection RedundantIfStatementJS
  if (roundNumber === 12 && numberOfPlayer === 2) return true;
  return false;
}

// function validatePlayer(uid, room) {}
