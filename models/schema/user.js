const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
   [
      {
         firstName: String,
         lastName: String,
         username: String,
         email: String,
         password: String,
         isVerified: { type: Boolean, default: false }
      }
   ],
   {
      timestamps: { createdAt: true, updatedAt: true }
   }
);

module.exports = userSchema;