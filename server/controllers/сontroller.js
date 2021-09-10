const games = require("./index");

class Controller {
  join(req, res) {
    try {
      const { userName, id, role } = req.body;

      if (!userName || !role || !id) {
        return res.status(400).json({ message: "Invalid data" });
      }

      if (role !== "observer" && role !== "player") {
        return res.status(400).json({ message: "Invalid role" });
      }

      if (userName.length < 4 || userName.length > 30) {
        return res.status(400).json({ message: "Invalid nickname" });
      }

      const gameInfo = games.get(id);

      if (!gameInfo) {
        return res.status(400).json({ message: "Game not found" });
      }

      if (gameInfo.usersArray.find((user) => user.userName === userName)) {
        return res.status(400).json({ message: "User Already Exist" });
      }

      const newUsersArray = [...gameInfo.usersArray, { userName, role }];
      games.set(id, { ...gameInfo, usersArray: newUsersArray });

      return res.status(200).json({ message: "Join was successful" });
    } catch (e) {
      console.log(e);
    }
  }

  removeUser(req, res) {
    try {
      const { userName, id } = req.body;

      if (!userName || !id) {
        return res.status(400).json({ message: "Invalid data" });
      }

      if (userName.length < 4 || userName.length > 30) {
        return res.status(400).json({ message: "Invalid nickname" });
      }

      const gameInfo = games.get(id);

      if (!gameInfo) {
        return res.status(400).json({ message: "Game not found" });
      }

      const newUsersArray = gameInfo.usersArray.filter(
        (user) => user.userName !== userName
      );
      games.set(id, { ...gameInfo, usersArray: newUsersArray });

      return res.status(200).json({ message: "User deleted successfully" });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new Controller();
