import { logger } from "../utils/constants.js";
import { BookCollection } from "./BookCollection.js";
import { sequelize } from "./db.js";
import { DataTypes } from "sequelize";

export const BookReadingState = sequelize.define("Book_Reading_State", {
  reading_state: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isIn: [["Currently reading", "Did not finish", "Want to read", "Read"]],
    },
  },
  page_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  starting_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  finishing_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

BookReadingState.addHook("beforeUpdate", (instance, options) => {
  if (instance.reading_state === "Currently reading") {
    instance.starting_date = new Date();
    instance.finishing_date = null;
  } else if (instance.reading_state === "Read") {
    instance.starting_date =
      instance.starting_date == null ? new Date() : instance.starting_date;
    instance.finishing_date = new Date();
  } else {
    instance.starting_date = null;
    instance.finishing_date = null;
  }
});

BookReadingState.addHook("afterUpdate", async (instance, options) => {
  const prev = instance.previous("reading_state");
  const curr = instance.reading_state;
  if (prev != "Read" && curr == "Read") {
    await BookCollection.update(
      { people_read: sequelize.literal("people_read + 1") },
      {
        where: {
          id: instance.bookId,
        },
      }
    );
  } else if (prev == "Read" && curr != "Read") {
    await BookCollection.update(
      { people_read: sequelize.literal("people_read - 1") },
      {
        where: {
          id: instance.bookId,
        },
      }
    );
  }
});
