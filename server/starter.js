import { app } from "./server.js";
import { logger } from "./utils/constants.js";

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
