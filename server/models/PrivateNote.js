import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";

export const PrivateNote = sequelize.define("Private_Note", {
  private_note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});
