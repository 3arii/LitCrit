import mongoose from "mongoose";

const schema = mongoose.Schema;
const admin_schema = new schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.model("admin", admin_schema);
