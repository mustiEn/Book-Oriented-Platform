import tracerLogger from "tracer";
import { sequelize } from "../models/db.js";
import { QueryTypes } from "sequelize";
import Sentiment from "sentiment";

import "colors";

const logger = tracerLogger.colorConsole({
  format: "({{timestamp}} ~~ in {{file}}:{{line}}) ==> {{message}}".blue,
  dateformat: "HH:MM:ss",
});

const returnRawQuery = (query, queryType) => {
  return sequelize.query(query, {
    type: queryType || QueryTypes.SELECT,
  });
};

const initializeReviewer = async () => {
  return new Sentiment();
};

export { logger, returnRawQuery, initializeReviewer };
