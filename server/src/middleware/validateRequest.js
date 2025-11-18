import { ZodError } from 'zod';

export const validateRequest = (schema, location = 'body') => {
  return (req, res, next) => {
    try {
      const payload = req[location];
      const parsed = schema.parse(payload);
      req.validatedData = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const firstIssue = error.issues?.[0];
        return res.status(400).json({
          error: firstIssue?.message || 'Invalid request data',
        });
      }
      next(error);
    }
  };
};
