import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";

export const Topic = sequelize.define(
  "Topic",
  {
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    post_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    follower_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    indexes: [{ unique: true, fields: ["topic"] }],
    timestamps: false,
  }
);
