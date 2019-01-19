import { toast } from "react-toastify";
import { playerColors, playerNames } from "./store";
import { css } from "glamor";
import React from "react";
import Typography from "@material-ui/core/Typography/Typography";

const getEventLabel = event => {
  switch (event.type) {
    case "wrongMove":
      return `wrongly played ${event.card}`;
    case "discard":
      return `discard ${event.cards.map(c => c.card).join(" ")}`;
    case "wrongMoveLeadToNextRoom":
      return "As all cards were played or discarded you can go to the next round !";
    case "goodMove":
      return `played ${event.card}`;
    default:
      return "idk ???";
  }
};

const CustomToast = ({ playerColor, playerName, event }) => (
  <Typography>
    <span style={{ color: playerColor, fontWeight: "bold" }}>{playerName}</span>{" "}
    {getEventLabel(event)}
  </Typography>
);

export const enqueueNotification = store => next => action => {
  const state = store.getState();
  if (
    action.type === "SET_ROOM" &&
    state.currentRoom.events !== undefined &&
    action.room.events.length > state.currentRoom.events.length
  ) {
    const currentEvents = state.currentRoom.events.filter(
      e => e.type !== "goodMove"
    );
    const _playerColors = playerColors(state);
    const _playerNames = playerNames(state);

    const newEvents = action.room.events
      .filter(e => e.type !== "goodMove")
      .slice(currentEvents.length);
    for (const event of newEvents) {
      const playerName = _playerNames[event.playerId].toUpperCase();
      const playerColor = _playerColors[event.playerId];
      toast(
        <CustomToast
          playerName={playerName}
          playerColor={playerColor}
          event={event}
        />,
        {
          className: css({
            borderStyle: "solid",
            borderWidth: "5px",
            boxSizing: "border-box",
            borderColor: "red"
          })
        }
      );
    }
  }
  return next(action);
};
