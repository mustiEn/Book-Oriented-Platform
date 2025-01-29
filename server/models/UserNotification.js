import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const UserNotification = sequelize.define("UserNotification", {
  notification: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
