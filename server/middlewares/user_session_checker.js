export const isUserActive = (req, res, next) => {
  const userId = req.session.passport?.user;
  if (!userId) {
    console.log("User session not valid");
    return res.status(401).json({ message: "User session not valid" });
  }
  next();
};
