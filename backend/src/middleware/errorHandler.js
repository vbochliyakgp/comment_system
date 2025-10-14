const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.sendError('Something went wrong on the server', 500);
};

export default errorHandler;
