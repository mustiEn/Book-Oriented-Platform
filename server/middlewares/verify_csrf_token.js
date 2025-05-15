import Tokens from "csrf";
const tokens = new Tokens();

export const verifyCsrfToken = (req, res, next) => {
  const secret = req.session.csrfSecret;
  const csrfToken = req.headers["csrf-token"];

  if (!tokens.verify(secret, csrfToken)) {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }

  next();
};
