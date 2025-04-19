import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";
import { Post } from "./Post.js";
import { logger } from "../utils/constants.js";

export const Comment = sequelize.define("Comment", {
  comment: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
});

Comment.addHook("afterCreate", async (comment, options) => {
  try {
    await Post.create(
      {
        postId: comment.id,
        post_type: "comment",
        userId: comment.userId,
      },
      { transaction: options.t }
    );
  } catch (error) {
    logger.log(error);
    throw error;
  }
});
