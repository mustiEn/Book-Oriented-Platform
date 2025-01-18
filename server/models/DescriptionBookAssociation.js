import { sequelize } from "./db.js";
import { Model } from "sequelize";

export class DescriptionBookAssociation extends Model {}

DescriptionBookAssociation.init(
  {},
  {
    timestamps: true,
    modelName: "DescriptionBookAssociation",
    tableName: "description_book_association",
    sequelize,
  }
);
