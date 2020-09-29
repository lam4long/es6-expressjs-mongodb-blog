import Redis from 'ioredis';

import { isProduction, redisConfig } from '../config';

let redisClient;

export function getRedisClient() {
	return redisClient;
}

export default async function redisSetup() {
	try {
		redisClient = await new Redis(redisConfig);
		if (!isProduction) {
			console.log('Redis Connected to %s', redisConfig.host);
		}
	} catch (err) {
		console.error('Redis connection error:', err.message);
		process.exit(1);
	}
}
