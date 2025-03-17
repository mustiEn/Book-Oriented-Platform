import path from "path";
import { app } from "./server.js";
import { logger } from "./utils/constants.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "client",
  "public",
  "Pps_and_Bgs",
  "6_bg_2025_02_02_126931149_Screenshott.png"
);
logger.log(filePath);

// const port = process.env.PORT || 8081;
// logger.log("STARTER FILE");
// if (process.env.NODE_ENV !== "test") {
//   app.listen(port, () => {
//     logger.log(`Server is running on port ${port}`);
//   });
// } else if (process.env.NODE_ENV === "test") {
//   app.use((req, res, next) => {
//     req.session = req.session ?? {};
//     req.session.passport = req.session.passport ?? {};
//     req.session.passport.user = 6;
//     console.log(req.session);

//     next();
//   });
// }
