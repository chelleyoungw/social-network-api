const { Thought } = require("../models");
const { Types } = require("mongoose");

module.exports = {
  // Gets all thoughts.
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find().select(`-__v`);
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Gets one thought based on the id in the url.
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({
        _id: req.params.thoughtId,
      }).select(`-__v`);
      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Creates a new thought.
  async createThought(req, res) {
    try {
      const thoughtData = await Thought.create(req.body);
      /* Example Data
        {
          "thoughtText": "Here's a cool thought...",
          "username": "lernantino",
          "userId": "5edff358a0fcb779aa7b118b"
        }
      */
      res.json(thoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Updates one thought based on the id in the url.
  async updateThought(req, res) {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        req.body,
        { new: true }
      );
      /* Example Data
        {
          "thoughtText": "Here's a cool thought...",
          "username": "lernantino",
          "userId": "5edff358a0fcb779aa7b118b"
        }
      */
      if (!updatedThought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }
      res.json(updatedThought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Deleted one thought based on the id in the url.
  async deleteThought(req, res) {
    try {
      const deletedThought = await Thought.findOneAndDelete({
        _id: req.params.thoughtId,
      });
      if (!deletedThought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }
      res.json({ message: "Thought deleted successfully" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Creates a new reaction for a thought based on the id.
  async createReaction(req, res) {
    try {
      // Sets variable thought equal to the full thought associated with the id in the url.
      const thought = await Thought.findById(req.params.thoughtId);
      // Sets variable reactionId equal to a unique generated objectId.
      const reactionId = new Types.ObjectId();
      // Extracts and properly sets variables from the request body.
      const { reactionText, username } = req.body;
      /* Example Data
          {
            "reactionText": "I agree with this thought!",
            "username": "example_user"
          }
        */
      // Builds the full reaction object using the above variables.
      const reaction = {
        reactionId,
        reactionText,
        username,
      };
      // Checks if the thought exists.
      if (!thought) {
        return res.status(404).json({ message: "Thought not found" });
      }
      // Adds the reaction to the thought's reactions array.
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: reaction } },
        { new: true }
      );
      await thought.save();
      // Returns thought with new reaction and the new reaction or an error.
      res.json({ thought, reaction });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Deletes one reaction from a thought based on both ids in the url.
  async deleteReaction(req, res) {
    try {
      const thought = await Thought.findById(req.params.thoughtId);
      const reactionId = req.params.reactionId;
      // Checks if the thought exists.
      if (!thought) {
        return res.status(404).json({ message: "Thought not found" });
      }
      // Checks if the reaction exists in the thought's reactions array.
      if (
        !thought.reactions.some((reaction) =>
          reaction.reactionId.equals(reactionId)
        )
      ) {
        return res.status(400).json({ message: "Reaction not found" });
      }
      // Removes the reactionId from the thoughts's reactions array.
      thought.reactions = thought.reactions.filter(
        (reaction) => !reaction.reactionId.equals(reactionId)
      );
      await thought.save();
      // Returns thought without reaction or an error.
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
