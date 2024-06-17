const { Schema, Types, model } = require("mongoose");
const { formatDate } = require("date-fns");

// Defines the shape for the "child" reaction subdocument.
const reactionSchema = new Schema({
  reactionId: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  reactionText: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 280,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (createdAt) => formatDate(createdAt, "MMMM d, yyyy 'at' h:mma"),
  },
  username: { type: String, required: true },
});

// Defines the shape for the "parent" thought document.
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAt) => formatDate(createdAt, "MMMM d, yyyy 'at' h:mma"),
    },
    username: { type: String, required: true },
    // Allows full reaction objects to be stored in the thought.reactions array.
    reactions: [reactionSchema],
  },
  {
    // Includes virtuals in response and force the date to be converted.
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.createdAt = formatDate(ret.createdAt, "MMMM d, yyyy 'at' h:mma");
        return ret;
      },
    },
    id: false,
  }
);

// Creates a virtual property `reactionCount` that gets the amount of reactions per thought.
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

// Initialize the thought model
const Thought = model("Thought", thoughtSchema);

module.exports = Thought;
