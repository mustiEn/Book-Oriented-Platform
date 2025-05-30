import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { Post } from "./Post.js";

export const Review = sequelize.define("Review", {
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  review: {
    type: DataTypes.STRING(1500),
    allowNull: false,
  },
});

Review.addHook("afterCreate", async (review, options) => {
  try {
    await Post.create({
      postId: review.id,
      post_type: "review",
      topicId: review.topicId ?? null,
      userId: review.userId,
    });
  } catch (error) {
    throw error;
  }
});
