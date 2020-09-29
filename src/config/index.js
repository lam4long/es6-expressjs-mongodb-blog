import dotenv from 'dotenv';

dotenv.config();

export const MONGODB_URL = process.env.MONGODB_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION;
export const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION;
export const REDIS_URL = process.env.REDIS_URL;
export const REDIS_PORT = process.env.REDIS_PORT;
export const isProduction = process.env.NODE_ENV === 'production';

export const redisConfig = {
	post: REDIS_PORT,
	host: REDIS_URL,
	family: 4,
};
