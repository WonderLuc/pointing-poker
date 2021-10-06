const { Excludor } = require("./Excludor");
const uuid = require("uuid");

const rooms = require("./socket-index");

function setSocketListeners(socket) {
  try {
    socket.on("initExclude", onInitExclude);
    socket.on("confirmExclude", onSocketConfirmExclude);
    socket.on("sendMessage", onSocketSendMessage);
    socket.on("disconnect", onDisconnect);
    socket.on('startRound', onRoundStart);
    socket.on('stopRound', onRoundStop);
    socket.on('setCard', onSetCard);
    return socket;
  } catch (e) {
    console.log(e);
  }
}

function onInitExclude(id, excluding, isInstantExclude) {
  const room = rooms.get(id);
  if (isInstantExclude) {
    room.excludeMember(excluding.user, excluding);
    sendServiceMessage(room, "user was excluded");
  } else {
    room.game = { ...room.game, excluding: { ...excluding, isActive: true } };
    members = room.getMembers().filter((user) => {
      return true;
    });
    room.askToExclude(new Excludor(room.getMembers()));
    sendServiceMessage(room, "voting started");
  }
}

function onSocketConfirmExclude(id, userID, answer) {
  const room = rooms.get(id);
  room.writeExcludeAnswer(userID, answer);
}

const onSocketSendMessage = (gameId, userId, message, authorMessage) => {
  const room = rooms.get(gameId);
  room.emit(`updateChatMessages`, {
    message,
    userId,
    messageId: uuid.v4(),
    authorMessage,
  });
};

function onDisconnect() {
  // This timeout gives a user a chance to refresh connection
  setTimeout(() => {
    let keyForDelete = undefined;
    rooms.forEach((room, key) => {
      if (room.filterDisconnected()) {
        room.emit("cancelGame");
        keyForDelete = key;
      }
    });
    rooms.delete(keyForDelete);
  }, 10000);
}

function sendServiceMessage(room, message) {
  room.emit(`updateChatMessages`, {
    message,
    messageId: uuid.v4(),
    isServiceMessage: true,
  });
}

function onSetCard(gameID, userID, choose) {
  const room = rooms.get(gameID);
  room.setCard(userID, choose);
}

function onRoundStart(gameID) {
  const room = rooms.get(gameID);
  room.clearRound();
  room.startRound();
}


function onRoundStop(gameID) {
  const room = rooms.get(gameID);
  room.stopRound();
}

module.exports = {
  setSocketListeners,
};
