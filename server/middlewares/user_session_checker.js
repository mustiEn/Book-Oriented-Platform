export const isUserActive = (req, res, next) => {
  const userId = req.session.passport?.user;
  if (!userId) {
    return res.status(401).json({ message: "User session not valid" });
  }
  next();
};
