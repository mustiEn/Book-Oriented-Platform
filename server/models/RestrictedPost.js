import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";
import { Post } from "./Post.js";
import { Notification } from "./Notification.js";

export const RestrictedPost = sequelize.define("restricted_post", {
  request_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  context: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sexual: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
  },
  discriminatory: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
  },
  insulting: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
  },
  violent: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
  },
  toxic: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
  },
  self_harm: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
  },
});

RestrictedPost.addHook("afterCreate", async (post, options) => {
  await Post.update(
    {
      restricted: true,
    },
    {
      where: {
        postId: post.postId,
      },
    }
  );
  await Notification.create({
    content: {
      text: post.context,
      postId: post.postId,
    },
    type: "post",
    receiverId: post.userId,
  });
});
