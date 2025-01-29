import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";
import { Topic } from "./Topic.js";
import { logger } from "../utils/constants.js";

export const Post = sequelize.define(
  "Post",
  {
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    post_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comment_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    restricted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { timestamps: true, indexes: [{ fields: ["post_type"] }] }
);

Post.addHook("afterCreate", async (post, options) => {
  logger.log(post.dataValues.topicId);
  if (post.get("post_type") != "comment") {
    await Topic.update(
      {
        post_count: sequelize.literal("post_count + 1"),
      },
      {
        where: {
          id: post.dataValues.topicId,
        },
      }
    );
  }
});
