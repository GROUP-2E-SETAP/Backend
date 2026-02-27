import { ApiError } from '../utils/apiError.js'

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error(err);

  // Mongoose bad ObjectId -- ( removed as we are using MongoClient )

  // MongoClient duplicate key ( also handles database operation failure ) 
  if (err.name == "MongoServerError") {
    if (err.code === 11000){
      const message = "Duplicate value with unique index entered" ; 
      error = new ApiError(400,message) ; 
    } else {
      const message = "MongoDb database operation failed" ; 
      error = new ApiError(500,message) ; 
    }
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ApiError(400, message);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new ApiError(401, message);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new ApiError(401, message);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler ; 
