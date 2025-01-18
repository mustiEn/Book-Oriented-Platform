import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";

export const RatedBook = sequelize.define("Rated_Book", {
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  },
});
