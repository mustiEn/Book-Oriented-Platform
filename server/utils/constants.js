import tracerLogger from "tracer";
import { sequelize } from "../models/db.js";
import { QueryTypes } from "sequelize";
import Sentiment from "sentiment";

import "colors";

const logger = tracerLogger.colorConsole({
  format: "({{timestamp}} ~~ in {{file}}:{{line}}) ==> {{message}}".blue,
  dateformat: "HH:MM:ss",
});

const returnFromRaw = async (
  query,
  params = [],
  queryType = QueryTypes.SELECT
) => {
  return await sequelize.query(query, {
    replacements: params,
    type: queryType,
  });
};

const initializeReviewer = async () => {
  return new Sentiment();
};

export { logger, returnFromRaw, initializeReviewer };
