const { User, Thought } = require("../models");

module.exports = {
  // Gets all users.
  async getUsers(req, res) {
    try {
      const users = await User.find().select(`-__v`);
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Gets one user based on the id in the url.
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId }).select(
        `-__v`
      );
      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Creates a new user.
  async createUser(req, res) {
    try {
      const userData = await User.create(req.body);
      /* Example Data
        {
            "username": "lernantino",
            "email": "lernantino@gmail.com"
        }
      */
      res.json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Updates one user based on the id in the url.
  async updateUser(req, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.userId },
        req.body,
        { new: true }
      );
      /* Example Data
        {
            "username": "lernantino",
            "email": "lernantino@gmail.com"
        }
      */
      if (!updatedUser) {
        return res.status(404).json({ message: "No user with that ID" });
      }
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Deleted one user and all their thoughts based on the id in the url.
  async deleteUser(req, res) {
    try {
      // Sets the variable userId equal to the id placed in the url.
      const userId = req.params.userId;
      // Find the full user based on the userId.
      const user = await User.findById(userId);
      // Checks if a user with that ID exists.
      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }
      // Sets the variable username equal to the found users username.
      const username = user.username;
      // Deletes all thoughts associated with the user then the user or returns an error.
      await Thought.deleteMany({ username });
      await User.findOneAndDelete({ _id: userId });
      res.json({ message: "User and user's thoughts deleted successfully" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Creates a new friend for a user based on both ids in the url.
  async createFriend(req, res) {
    try {
      const user = await User.findById(req.params.userId);
      const friendId = req.params.friendId;
      // Checks if the user exists.
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Checks if the friendId is the same as the userId.
      if (user._id.toString() === friendId) {
        return res
          .status(400)
          .json({ message: "Cannot add yourself as a friend" });
      }
      // Checks if the friend already exists in the user's friends array.
      if (user.friends.includes(friendId)) {
        return res.status(400).json({ message: "Friend already exists" });
      }
      // Adds the friendId to the user's friends array.
      user.friends.push(friendId);
      await user.save();
      // Returns user with new friend or an error.
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Deletes one friend from a user based on both ids in the url.
  async deleteFriend(req, res) {
    try {
      const user = await User.findById(req.params.userId);
      const friendId = req.params.friendId;
      // Checks if the user exists.
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Checks if the friend exists in the user's friend array.
      if (!user.friends.includes(friendId)) {
        return res.status(400).json({ message: "Friend not found" });
      }
      // Removes the friendId from the user's friends array.
      user.friends = user.friends.filter(
        (friend) => friend.toString() !== friendId
      );
      await user.save();
      // Returns user without friend or an error.
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
