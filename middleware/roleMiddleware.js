const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      error: "FORBIDDEN",
      message: "Admin access required",
    });
  }

  next();
};

module.exports = isAdmin;