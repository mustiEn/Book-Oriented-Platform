import { sequelize } from "./db.js";
import { Model } from "sequelize";

export class AuthorBookAssociation extends Model {}

AuthorBookAssociation.init(
  {},
  {
    timestamps: true,
    modelName: "AuthorBookAssociation",
    tableName: "author_book_association",
    sequelize,
  }
);
