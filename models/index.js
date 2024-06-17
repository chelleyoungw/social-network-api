const { Schema, model } = require("mongoose");

// Defines the shape for the user document.
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    // Includes virtuals in response.
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// Creates a virtual property `friendCount` that gets the amount of friends per user.
userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

// Initializes and exports the user model.
const User = model("User", userSchema);
module.exports = User;
