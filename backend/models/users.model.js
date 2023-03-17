const mongoose = require('mongoose');

const schema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    token: {
      type: String,
    },
    filters: [{}],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', schema);
module.exports = User;
