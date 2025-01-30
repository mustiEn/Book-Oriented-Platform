import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const Transaction = sequelize.define("transaction", {
  cardholder_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  postal_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customer_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  checkout_session_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  payment_status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  payment_method_configuration_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subscription_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
