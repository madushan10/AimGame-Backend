const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const partnerSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  company: {
    type: String,
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: "Client",
  },
  image: {
    type: String, // Assuming you store the image URL or file path
    // You might want to use a dedicated library or service for handling image uploads
  },
  workspaceId: {
    type: Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  contacts: [
    {
      name: {
        type: String,
        required: true,
      },
      designation: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        // Validate email format
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        required: true,
      },
      phone: {
        type: String,
        match: /^\d{10}$/,
        required: true,
      },
      isPrimary: {
        type: Boolean,
        default: true,
      },
    },
  ],
});

partnerSchema.pre("find", function (next) {
  this.populate({
    path: "clientId",
    select: "email phone"
  });
  this.populate("workspaceId", "name"); 
  next();
});

module.exports = mongoose.model("Partner", partnerSchema);
