import dotenv from 'dotenv';

dotenv.config();

export const MONGODB_URL = process.env.MONGODB_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_TIMEOUT_DURATION = process.env.JWT_TIMEOUT_DURATION;
export const isProduction = process.env.NODE_ENV === 'production';
