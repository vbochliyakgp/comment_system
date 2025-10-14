const responseMiddleware = (req, res, next) => {
  res.sendSuccess = (message, data = null, status = 200) => {
    return res.status(status).json({
      success: true,
      message,
      data,
    });
  };

  res.sendCreated = (message, data = null) => {
    return res.sendSuccess(message, data, 201);
  };

  res.sendNoContent = () => {
    return res.status(204).send();
  };

  res.sendError = (message, status = 500, data = null) => {
    return res.status(status).json({
      success: false,
      message,
      data,
    });
  };

  next();
};

export default responseMiddleware;
