export const notFound = (req, res, _next) => {
  res.status(404).json({
    error: `Route ${req.originalUrl} not found`,
  });
};
