import { DataTypes } from "sequelize";
import sequelize from "./db.js";

export default sequelize.define("User", {
  username: { type: DataTypes.STRING, required: true, unique: true },
  email: { type: DataTypes.STRING, required: true, unique: true },
  password: { type: DataTypes.STRING, required: true },
  role: { type: DataTypes.STRING, required: true, defaultValue: "user" },
});