import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";
import { Post } from "./Post.js";

export const Quote = sequelize.define("Quote", {
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  quote: {
    type: DataTypes.STRING(1500),
    allowNull: false,
  },
  page: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Quote.addHook("afterCreate", async (quote, options) => {
  await Post.create({
    postId: quote.id,
    post_type: "quote",
    topicId: quote.topicId ?? null,
    userId: quote.userId,
  });
});
