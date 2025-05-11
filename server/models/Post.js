import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";
import { Topic } from "./Topic.js";
import { Notification } from "./Notification.js";
import { logger, returnRawQuery } from "../utils/constants.js";

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
  if (post.get("post_type") != "comment" && post.dataValues.topicId) {
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
  if (post.dataValues.topicId) {
    const topic = await Topic.findByPk(post.dataValues.topicId);
    const sql = `
      SELECT UserId 
        FROM user_topic_association
        WHERE TopicId = ${post.dataValues.topicId}`;
    const users = await returnRawQuery(sql);
    for (const user of users) {
      if (user == post.dataValues.userId) continue;
      await Notification.create({
        receiverId: user.UserId,
        type: "topic_post",
        content: {
          topic: topic.toJSON().topic,
          postType: post.get("post_type"),
          postId: post.get("id"),
        },
      });
    }
  }
});
