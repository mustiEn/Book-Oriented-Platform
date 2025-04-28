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
  end_date: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  interval: {
    type: DataTypes.STRING,
    allowNull: false,
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
