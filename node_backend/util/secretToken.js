import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export const createSecretToken = (id, username) => {
  return jwt.sign({ id, username }, process.env.TOKEN_KEY, {
    expiresIn: '3d', // More readable format
  });
};
