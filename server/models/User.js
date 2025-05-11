import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const User = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    DOB: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["Male", "Female"]],
      },
    },
    profile_photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    background_photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    indexes: [
      { fields: ["email"], unique: true },
      { fields: ["username"], unique: true },
      { fields: ["firstname"], unique: false, type: "FULLTEXT" },
      { fields: ["lastname"], unique: false, type: "FULLTEXT" },
    ],
  }
);
