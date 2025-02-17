import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";

export const RestrictedPost = sequelize.define("restricted_post", {
  request_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  context: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sexual: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
  },
  discriminatory: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
  },
  insulting: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
  },
  violent: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
  },
  toxic: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
  },
  self_harm: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
  },
  post_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
