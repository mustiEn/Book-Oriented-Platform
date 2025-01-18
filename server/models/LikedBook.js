import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";

export const LikedBook = sequelize.define("Liked_Book", {
  is_liked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
});
