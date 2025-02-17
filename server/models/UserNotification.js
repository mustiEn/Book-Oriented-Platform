import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const UserNotification = sequelize.define("user_notification", {
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});
