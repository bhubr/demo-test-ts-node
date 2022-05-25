import dotenv from 'dotenv';

dotenv.config();

export const port = process.env.PORT || 5000;

export const jwtSecret = process.env.JWT_SECRET || 'secret';

export const isProd = process.env.NODE_ENV === 'production';
