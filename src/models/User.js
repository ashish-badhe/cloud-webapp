import { DataTypes } from "sequelize";
import { sequelize } from "../databaseConfig/dbConnect.js";

export const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "username"
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "token"
    },
    emailSentTime: {
      type: DataTypes.DATE
    },
    verification_email:{
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    verified:{
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    timestamps: true,
    createdAt: "account_created",
    updatedAt: "account_updated",
  }
);
