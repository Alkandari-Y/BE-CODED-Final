exports.errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json(
    err.message || {
      message: "Something Broke! Internal Server Error!",
    }
  );
};
