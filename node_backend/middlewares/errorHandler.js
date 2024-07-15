/**
 * This is a description of the function.
 * It does something useful with the given parameters.
 * 
 * @param {number} param1 - The first parameter, which must be a number.
 * @param {string} param2 - The second parameter, which must be a string.
 * @returns {boolean} Returns `true` if successful, `false` otherwise.
 * @throws {TypeError} If either a or b is not a number.
 *
 * @example
 * const result = add(5, 3);
 * console.log(result); // Outputs: 8
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Default to 500 server error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific types of errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(error => error.message).join(', ');
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate key error';
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
};

export default errorHandler;