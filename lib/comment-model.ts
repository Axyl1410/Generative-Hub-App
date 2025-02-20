import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    tokenId: { type: String, required: true },
    username: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const CommentModel =
  mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
export default CommentModel;
