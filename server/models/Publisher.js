import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";

export const Publisher = sequelize.define(
  "Publisher",
  {
    publisher: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { timestamps: false, indexes: [{ fields: ["publisher"], unique: true }] }
);
