import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";
import { Post } from "./Post.js";
import { logger } from "../utils/constants.js";
import { Notification } from "./Notification.js";
import { User } from "./User.js";

export const Comment = sequelize.define("Comment", {
  comment: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
});

Comment.addHook("afterCreate", async (comment, options) => {
  try {
    const post = await Post.create(
      {
        postId: comment.id,
        post_type: "comment",
        userId: comment.userId,
        receiverId: comment.receiverId,
      },
      { transaction: options.t }
    );

    if (post.userId != post.receiverId) {
      await Notification.create(
        {
          content: {
            id: post.toJSON().id,
            senderId: comment.userId,
          },
          type: "comment",
          receiverId: comment.receiverId,
        },
        { transaction: options.t }
      );
    }
  } catch (error) {
    logger.log(error);
    throw error;
  }
});
