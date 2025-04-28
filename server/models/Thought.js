import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";
import { Post } from "./Post.js";

export const Thought = sequelize.define(
  "Thought",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    thought: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true }
);

Thought.addHook("afterCreate", async (thought, options) => {
  try {
    await Post.create({
      postId: thought.id,
      post_type: "thought",
      topicId: thought.topicId ?? null,
      userId: thought.userId,
    });
  } catch (error) {
    logger.log(error);
    throw error;
  }
});
