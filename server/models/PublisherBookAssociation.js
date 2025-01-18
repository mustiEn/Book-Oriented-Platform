import { sequelize } from "./db.js";
import { Model } from "sequelize";

export class PublisherBookAssociation extends Model {}

PublisherBookAssociation.init(
  {},
  {
    timestamps: true,
    modelName: "PublisherBookAssociation",
    tableName: "publisher_book_association",
    sequelize,
  }
);
