import { sequelize } from "./db.js";
import { Model } from "sequelize";

export class CategoryBookAssociation extends Model {}

CategoryBookAssociation.init(
  {},
  {
    timestamps: true,
    modelName: "CategoryBookAssociation",
    tableName: "category_book_association",
    sequelize,
  }
);
