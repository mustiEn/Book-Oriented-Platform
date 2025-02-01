import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const Subscription = sequelize.define("subscription", {
  subscription_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customer_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cancel_at: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  canceled_at: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  start_date: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  billing_cycle_anchor: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  interval: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  feedback: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  amount_total: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
