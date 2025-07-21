import { logger } from '../utils/logger';

export default defineEventHandler((event) => {
  const { method, url, headers } = event.node.req;
  const userAgent = headers['user-agent'] || 'Unknown';
  const ip = headers['x-forwarded-for'] || 'Unknown';

  logger.info(`[${method}] ${url} - IP: ${ip} - User-Agent: ${userAgent}`);
});
