import Tokens from "csrf";
const tokens = new Tokens();

export const createCsrfToken = (req, res, next) => {
  try {
    if (!req.session.csrfSecret) {
      req.session.csrfSecret = tokens.secretSync();
    }
    const token = tokens.create(req.session.csrfSecret);
    res.json({ csrfToken: token });
  } catch (error) {
    next(error);
  }
};
