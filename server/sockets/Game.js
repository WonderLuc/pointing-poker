const rooms = require("./socket-index");

function calculateTime(strTime) {
  let [ minute, seconds ] = strTime.split(':');
  minute = +minute * 60;
  seconds = +seconds + minute;
  return seconds * 1000;
}

class Game {
  roomID;
  stories;
  timer;
  players;
  decisions;
  isDealerPlay;
  isAutoFinish;
  isRoundActive;
  isVoteMutable;

  constructor(roomid, game, players) {
    this.roomID = roomid;
    this.stories = game.settings.stories;
    this.isDealerPlay = game.settings.isDealerInGame;
    this.isAutoFinish = game.settings.isAutoFinish;
    this.isVoteMutable = game.settings.isVoteMutable;
    this.timer = game.settings.isTimerRequired ? calculateTime(game.settings.timerValue) : undefined;
    this.isRoundActive = false;
    this.players = players;
    this.decisions = new Map();
  }

  setStory(storyID) {
    this.stories = this.stories.map((story) => {
      if (story.isActive) {
        story.isActive = false;
      }
      if (story.id === storyID) {
        story.isActive = true;
      }
      return story;
    });
  }

  addStory(story) {
    this.stories.push(story);
  }

  findActiveStory() {
    return this.stories.filter((story) => story.isActive)[0];
  }

  startRound() {
    const room = rooms.get(this.roomID);
    this.isRoundActive = true;
    // Added second for the network operations
    if (this.timer) {
      setTimeout(() => {
        this.stopRound();
      }, this.timer + 1000);
    }
    room.emit('startRound', this.isRoundActive);
  }

  stopRound() {
    if (!this.isRoundActive) return;
    const room = rooms.get(this.roomID);
    this.isRoundActive = false;
    room.emit('stopRound', this.isRoundActive);
  }

  addDecision(userID, decision) {
    const user = this.decisions.get(userID);
    this.decisions.set(userID, decision)
    if (this.isAutoFinish && this.decisions.size === this.players.length) {
      this.stopRound();
    } 
  }
  
  clearRound() {
    this.decisions.clear();
  }

  fillStory(result) {
    const story = this.findActiveStory();
    if (story) {
      story.estimation = result;
      story.isActive = false;
      story.isCompleted = true;
    }
    return story;
  }

  finishStory(result) {
    const story = this.fillStory(result);

    const room = rooms.get(this.roomID);
    room.emit('finishStory', story);
  }

  finishGame(result) {
    this.fillStory(result);

    const results = this.stories.length ? this.stories : result; 

    const room = rooms.get(this.roomID);
    room.emit('finishStory', results);
  }

  addPlayer(user) {
    this.players.push(user);
  }

  toString() {
    return `
    ${this.roomID}
    ${this.stories}
    ${this.isDealerPlay} = game.settings.isDealerInGame;
    ${this.isAutoFinish} = game.settings.isAutoFinish;
    ${this.isVoteMutable} = game.settings.isVoteMutable;
    ${this.timer} = game.settings.isTimerRequired ? game.settings.timerValue : undefined;
    ${this.isRoundActive} = false;
    ${this.playersNumber} = players
    `;
  }
}

module.exports = { Game };