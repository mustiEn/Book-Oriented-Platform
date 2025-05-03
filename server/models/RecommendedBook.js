import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const RecommendedBook = sequelize.define("recommended_book", {
  isClicked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
});
